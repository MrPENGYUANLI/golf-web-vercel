import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { useGameStore } from '../store/useGameStore'
import { searchCourses } from '../api/golfApi'
import type { AppCourse, GameSettings, WeatherType } from '../models/types'

const weathers: WeatherType[] = ['晴天','多云','雨天','大风']

export default function PlayerSetup() {
  const nav = useNavigate()
  const { players, courses, setCourses, addCoursesNoDup, loadSamplePlayers, startNewGame } = useGameStore()
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [course, setCourse] = useState<AppCourse | undefined>(undefined)
  const [base, setBase] = useState(20)
  const [weather, setWeather] = useState<WeatherType>('晴天')
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10))
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [netErr, setNetErr] = useState(false)

  useEffect(()=>{ if (players.length===0) loadSamplePlayers() },[])
  useEffect(()=>{
    (async()=>{
      try {
        setLoading(true)
        const res = await searchCourses('popular')
        addCoursesNoDup(res)
        setNetErr(false)
      } catch { setNetErr(true) }
      finally { setLoading(false) }
    })()
  },[])

  const filtered = useMemo(()=>{
    if (!q) return courses
    const lower = q.toLowerCase()
    return courses.filter(c => c.name.toLowerCase().includes(lower))
  }, [q, courses])

  const ready = selectedPlayers.length>0 && course

  async function doSearch(v: string) {
    setQ(v)
    if (v.length < 3) return
    try {
      setLoading(true)
      const res = await searchCourses(v)
      setCourses(res)
      setNetErr(false)
    } catch { setNetErr(true) }
    finally { setLoading(false) }
  }

  function start() {
    const chosen = players.filter(p => selectedPlayers.includes(p.id))
    const settings: GameSettings = {
      basePointsPerHole: base,
      players: chosen,
      course,
      date,
      weather
    }
    startNewGame(settings)
    nav('/live')
  }

  if (netErr) {
    return (
      <div style={{padding:24, textAlign:'center'}}>
        <h2>网络连接失败</h2>
        <p>无法加载球场数据，请检查网络后重试。</p>
        <button onClick={()=>doSearch('popular')}>重试</button>
      </div>
    )
  }

  return (
    <div style={{padding:16, display:'grid', gap:16}}>
      <h2>比赛设置</h2>

      <section>
        <h3>基本设置</h3>
        <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
          <label>每洞基础积分：
            <input type="range" min={10} max={100} step={5} value={base}
              onChange={e=>setBase(parseInt(e.target.value))}/>
            <b>{base}</b>
          </label>
          <label>日期：
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          </label>
          <label>天气：
            <select value={weather} onChange={e=>setWeather(e.target.value as any)}>
              {weathers.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section>
        <h3>球员选择</h3>
        {players.map(p=>(
          <label key={p.id} style={{display:'flex', alignItems:'center', gap:8}}>
            <input
              type="checkbox"
              checked={selectedPlayers.includes(p.id)}
              onChange={e=>{
                setSelectedPlayers(s => e.target.checked ? [...s, p.id] : s.filter(id=>id!==p.id))
              }}
            />
            <div style={{flex:1, display:'flex', justifyContent:'space-between'}}>
              <span>{p.name}（差点 {p.handicap}）</span>
              <span>{p.totalPoints.toFixed(1)} 分</span>
            </div>
          </label>
        ))}
      </section>

      <section>
        <h3>球场选择</h3>
        <SearchBar onChange={doSearch} placeholder="搜索球场"/>
        {loading ? <p>加载中...</p> : (
          <>
            <label>选择球场：
              <select value={course?.id ?? ''} onChange={e=>{
                const c = filtered.find(x => x.id === e.target.value)
                setCourse(c)
              }}>
                <option value="">请选择球场</option>
                {filtered.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </>
        )}
      </section>

      <button className="btn green" disabled={!ready} onClick={start}>开始比赛</button>
    </div>
  )
}
