import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseMap from '../components/CourseMap'
import DistanceBadge from '../components/DistanceBadge'
import { haversineDistance } from '../utils/geo'
import { useGameStore } from '../store/useGameStore'
import type { HoleResult, PlayerScore } from '../models/types'

export default function LiveGame() {
  const nav = useNavigate()
  const { currentGame, submitHoleScores, endCurrentGame } = useGameStore()
  const [scores, setScores] = useState<number[]>([])
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [result, setResult] = useState<HoleResult | null>(null)

  const hole = useMemo(()=> {
    const idx = currentGame?.currentHoleIndex ?? 0
    return currentGame?.settings.course?.holes[idx]
  }, [currentGame])

  useEffect(()=>{
    if (!currentGame || !hole) return
    setScores(Array(currentGame.settings.players.length).fill(0))

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => setUserPos([p.coords.latitude, p.coords.longitude]),
        () => setUserPos(null),
        { enableHighAccuracy: true, timeout: 8000 }
      )
    }
  }, [currentGame?.currentHoleIndex])

  if (!currentGame || !hole) return <div style={{padding:24}}>比赛加载中...</div>

  const players = currentGame.settings.players
  const pin = hole.pinLocation
  const tees = hole.mapCoordinates
  const playerLocations = Object.values(currentGame.playerLocations)

  const canSubmit = scores.filter(s=>s>0).length === players.length

  function submit() {
    const payload: PlayerScore[] = players.map((p, i)=>({ playerId: p.id, strokes: scores[i] }))
    const r = submitHoleScores(payload)
    if (r) setResult(r)
  }

  const isGameOver = currentGame.currentHoleIndex >= (currentGame.settings.course?.holes.length ?? 0)

  return (
    <div style={{padding:16, display:'grid', gap:16}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2>洞 #{hole.number}</h2>
          <div>标准杆：{hole.par}　距离：{hole.distance} 米</div>
        </div>
        <button onClick={()=>{
          endCurrentGame()
          nav('/history')
        }}>结束比赛</button>
      </header>

      <CourseMap pin={pin} tees={tees} players={playerLocations}/>

      {userPos && <DistanceBadge meters={haversineDistance(userPos, pin)} />}

      <section style={{background:'#fff3bf', padding:12, borderRadius:8}}>
        <h3>输入成绩：</h3>
        {players.map((p, i)=>(
          <div key={p.id} style={{display:'flex', alignItems:'center', gap:12, padding:'6px 0'}}>
            <div style={{flex:1}}>{p.name}</div>
            <input
              type="number" min={1} max={10}
              value={scores[i] ?? 0}
              onChange={e=>{
                const v = parseInt(e.target.value || '0')
                setScores(s => s.map((x, idx) => idx===i ? v : x))
              }}
              style={{width:80}}
            />
          </div>
        ))}
        <button className="btn green" disabled={!canSubmit} onClick={submit}>提交成绩</button>
      </section>

      {result && (
        <div style={{background:'#fff', border:'1px solid #dee2e6', borderRadius:8, padding:12}}>
          <h3>洞 #{result.holeNumber} 结果</h3>
          <div>标准杆：{result.par}</div>
          <h4>球员成绩</h4>
          {result.playerScores.map(s => (
            <div key={s.playerId}>玩家 {s.playerId.slice(0,4)}...：{s.strokes} 杆</div>
          ))}
          {result.carryOverRecord ? (
            <div style={{marginTop:8, color:'#d9480f'}}>
              全员平局：基础积分 {result.carryOverRecord.basePoints} 已累积到下一洞
            </div>
          ) : (
            <>
              <h4>积分分配（输家）</h4>
              {result.pointsAwarded && Object.entries(result.pointsAwarded).map(([pid, v])=>(
                <div key={pid}>玩家 {pid.slice(0,4)}...：<b style={{color:'#e03131'}}>{v.toFixed(1)} 分</b></div>
              ))}
            </>
          )}
          <div style={{marginTop:12, textAlign:'right'}}>
            <button onClick={()=>setResult(null)}>关闭</button>
          </div>
        </div>
      )}

      {isGameOver && <div style={{color:'#0b7285'}}>比赛已结束，可点击“结束比赛”查看汇总。</div>}
    </div>
  )
}
