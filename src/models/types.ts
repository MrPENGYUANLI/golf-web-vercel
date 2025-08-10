export interface Player {
  id: string
  name: string
  handicap: number
  totalPoints: number
}

export interface ApiCourse {
  id: string
  name: string
  location: string
  holes: ApiHole[]
}
export interface ApiHole {
  number: number
  par: number
  distance: number
  tee_coordinates: { latitude: number; longitude: number }[]
  pin_coordinate: { latitude: number; longitude: number }
}

export interface AppCourse {
  id: string
  name: string
  holes: AppHole[]
}
export interface AppHole {
  id: string
  number: number
  par: number
  distance: number
  mapCoordinates: [number, number][] // [lat, lng]
  pinLocation: [number, number]
}

export interface PlayerScore {
  playerId: string
  strokes: number
}

export interface HoleResult {
  holeNumber: number
  par: number
  playerScores: PlayerScore[]
  pointsAwarded?: Record<string, number>
  carryOverRecord?: CarryOverRecord
}

export interface CarryOverRecord {
  holeNumber: number
  basePoints: number
  previousCarryOver: number
  newCarryOver: number
  allScores: number[]
}

export type WeatherType = '晴天' | '多云' | '雨天' | '大风'

export interface GameSettings {
  basePointsPerHole: number
  players: Player []
  course?: AppCourse
  date: string
  weather: WeatherType
}

export interface GameState {
  id: string
  settings: GameSettings
  startTime: string
  currentHoleIndex: number
  holeResults: HoleResult[]
  finalPoints: Record<string, number>
  carryOverPoints: number
  playerLocations: Record<string, [number, number]>
}
