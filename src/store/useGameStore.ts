import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PointCalculator } from '../logic/pointCalculator'
import type { AppCourse, GameSettings, GameState, HoleResult, Player, PlayerScore } from '../models/types'

type Store = {
  players: Player[]
  courses: AppCourse[]
  pastGames: GameState[]
  totalPointsPool: number
  deductionHistory: { id: string; amount: number; date: string; reason: string }[]

  currentGame?: GameState
  calculator?: PointCalculator

  loadSamplePlayers: () => void
  setCourses: (c: AppCourse[]) => void
  addCoursesNoDup: (c: AppCourse[]) => void

  startNewGame: (settings: GameSettings) => void
  submitHoleScores: (scores: PlayerScore[]) => HoleResult | null
  endCurrentGame: () => void
  deductPoints: (amount: number, reason: string) => void
}

export const useGameStore = create<Store>()(
  persist(
    (set, get) => ({
      players: [],
      courses: [],
      pastGames: [],
      totalPointsPool: 0,
      deductionHistory: [],

      loadSamplePlayers() {
        set({
          players: [
            { id: crypto.randomUUID(), name: '张三', handicap: 12, totalPoints: 0 },
            { id: crypto.randomUUID(), name: '李四', handicap: 8, totalPoints: 0 },
            { id: crypto.randomUUID(), name: '王五', handicap: 15, totalPoints: 0 },
            { id: crypto.randomUUID(), name: '赵六', handicap: 5, totalPoints: 0 }
          ]
        })
      },

      setCourses(c) { set({ courses: c }) },
      addCoursesNoDup(c) {
        const existing = new Set(get().courses.map(x => x.id))
        set({ courses: [...get().courses, ...c.filter(x => !existing.has(x.id))] })
      },

      startNewGame(settings) {
        const game: GameState = {
          id: crypto.randomUUID(),
          settings,
          startTime: new Date().toISOString(),
          currentHoleIndex: 0,
          holeResults: [],
          finalPoints: {},
          carryOverPoints: 0,
          playerLocations: Object.fromEntries(
            settings.players.map(p => [
              p.id,
              [-37.8136 + (Math.random()-0.5)/500, 144.9631 + (Math.random()-0.5)/500] as [number, number]
            ])
          )
        }
        set({ currentGame: game, calculator: new PointCalculator(settings.basePointsPerHole) })
      },

      submitHoleScores(scores) {
        const { currentGame, calculator } = get()
        if (!currentGame || !calculator) return null
        const hole = currentGame.settings.course?.holes[currentGame.currentHoleIndex]
        if (!hole) return null

        const { points, carry } = calculator.calc(hole, scores)

        const result: HoleResult = {
          holeNumber: hole.number,
          par: hole.par,
          playerScores: scores
        }

        if (carry) {
          result.carryOverRecord = {
            holeNumber: hole.number,
            basePoints: currentGame.settings.basePointsPerHole,
            previousCarryOver: currentGame.carryOverPoints,
            newCarryOver: calculator.carryOverPoints,
            allScores: scores.map(s => s.strokes)
          }
          currentGame.carryOverPoints = calculator.carryOverPoints
        } else {
          result.pointsAwarded = points
          const updatedPlayers = currentGame.settings.players.map(p => ({
            ...p, totalPoints: p.totalPoints + (points[p.id] ?? 0)
          }))
          currentGame.settings.players = updatedPlayers
        }

        currentGame.holeResults.push(result)

        const last = (currentGame.settings.course?.holes.length ?? 0) - 1
        if (currentGame.currentHoleIndex < last) {
          currentGame.currentHoleIndex++
        } else {
          const finalPoints: Record<string, number> = {}
          for (const hr of currentGame.holeResults) {
            if (hr.pointsAwarded) {
              for (const [pid, v] of Object.entries(hr.pointsAwarded)) {
                finalPoints[pid] = (finalPoints[pid] ?? 0) + v
              }
            }
          }
          currentGame.finalPoints = finalPoints
        }

        set({ currentGame })
        return result
      },

      endCurrentGame() {
        const { currentGame, pastGames, totalPointsPool } = get()
        if (!currentGame) return
        const add = Object.values(currentGame.finalPoints).reduce((a, b) => a + b, 0)
        set({
          pastGames: [...pastGames, currentGame],
          currentGame: undefined,
          calculator: undefined,
          totalPointsPool: totalPointsPool + add
        })
      },

      deductPoints(amount, reason) {
        const pool = get().totalPointsPool
        if (amount <= 0 || amount > pool) return
        set({
          totalPointsPool: pool - amount,
          deductionHistory: [
            ...get().deductionHistory,
            { id: crypto.randomUUID(), amount, date: new Date().toISOString(), reason }
          ]
        })
      }
    }),
    { name: 'golf-web-store' }
  )
)
