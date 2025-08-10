import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'

export default function GameDetail() {
  const { id } = useParams()
  const { pastGames } = useGameStore()
  const game = useMemo(()=> pastGames.find(g=>g.id===id), [id, pastGames])
  if (!game) return <div style={{padding:16}}>未找到比赛</div>

  return (
    <div style={{padding:16, display:'grid', gap:16}}>
      <h2>{game.settings.course?.name ?? '比赛详情'}</h2>

      <section>
        <h3>基本信息</h3>
        <div>日期：{new Date(game.startTime).toLocaleDateString()}</div>
        <div>天气：{game.settings.weather}</div>
        <div>基础积分：{game.settings.basePointsPerHole} 分/洞</div>
      </section>

      <section>
        <h3>球员</h3>
        <ul>
          {game.settings.players.map(p=>(
            <li key={p.id}>{p.name}：{p.totalPoints.toFixed(1)} 分</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>洞结果</h3>
        <ul>
          {game.holeResults.map((r,i)=>(
            <li key={i} style={{marginBottom:8}}>
              <b>洞 #{r.holeNumber}（Par {r.par}）</b>
              <div>成绩：{r.playerScores.map(s=>`${s.playerId.slice(0,4)}..=${s.strokes}`).join('，')}</div>
              {r.carryOverRecord
                ? <div style={{color:'#d9480f'}}>平局累积：+{r.carryOverRecord.basePoints} → 当前累积 {r.carryOverRecord.newCarryOver}</div>
                : r.pointsAwarded && <div>积分（输家）：{Object.entries(r.pointsAwarded).map(([k,v])=>`${k.slice(0,4)}..=${v.toFixed(1)}`).join('，')}</div>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
