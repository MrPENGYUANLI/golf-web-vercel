import { Link } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'

export default function PastGames() {
  const { pastGames } = useGameStore()
  return (
    <div style={{padding:16}}>
      <h2>历史比赛</h2>
      <ul>
        {pastGames.map(g => (
          <li key={g.id} style={{padding:'8px 0', borderBottom:'1px solid #eee'}}>
            <Link to={`/game/${g.id}`}>
              <b>{g.settings.course?.name ?? '未知球场'}</b> · {new Date(g.startTime).toLocaleDateString()} · {g.settings.players.length} 名球员
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
