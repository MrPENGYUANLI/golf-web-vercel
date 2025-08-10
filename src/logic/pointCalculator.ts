import type { AppHole, PlayerScore } from '../models/types'

export class PointCalculator {
  carryOverPoints = 0
  constructor(public basePointsPerHole: number) {}

  calc(hole: AppHole, scores: PlayerScore[]) {
    if (scores.every(s => s.strokes === scores[0].strokes)) {
      this.carryOverPoints += this.basePointsPerHole
      return { points: {}, carry: true }
    }
    const mins = Math.min(...scores.map(s => s.strokes))
    const maxs = Math.max(...scores.map(s => s.strokes))
    const worstPlayers = scores.filter(s => s.strokes === maxs)

    const underPar = Math.max(0, hole.par - mins)
    const totalBase = this.basePointsPerHole + this.carryOverPoints
    this.carryOverPoints = 0

    const basePerLoser = worstPlayers.length ? totalBase / worstPlayers.length : 0
    const extra = underPar * this.basePointsPerHole

    const points: Record<string, number> = {}
    for (const p of worstPlayers) points[p.playerId] = basePerLoser + extra
    return { points, carry: false }
  }
}
