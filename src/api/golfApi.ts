import axios from 'axios'
import type { ApiCourse, AppCourse, AppHole } from '../models/types'

const api = axios.create({
  baseURL: '/api'
})

const API_KEY = import.meta.env.VITE_GOLF_API_KEY

export async function searchCourses(query: string): Promise<AppCourse[]> {
  const { data } = await api.get<{ clubs: ApiCourse[] }>('/golf/clubs', {
    params: { q: query, api_key: API_KEY }
  })
  return data.clubs.map(toAppCourse)
}

export async function fetchCourseDetails(id: string): Promise<AppCourse | null> {
  try {
    const { data } = await api.get<ApiCourse>(`/golf/clubs/${id}`, {
      params: { api_key: API_KEY }
    })
    return toAppCourse(data)
  } catch {
    return null
  }
}

function toAppCourse(c: ApiCourse): AppCourse {
  return {
    id: c.id,
    name: c.name,
    holes: c.holes.map<AppHole>(h => ({
      id: `${c.id}-${h.number}`,
      number: h.number,
      par: h.par,
      distance: h.distance,
      mapCoordinates: h.tee_coordinates.map(t => [t.latitude, t.longitude]),
      pinLocation: [h.pin_coordinate.latitude, h.pin_coordinate.longitude]
    }))
  }
}
