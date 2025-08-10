import { Routes, Route, Link } from 'react-router-dom'
import MainMenu from './pages/MainMenu'
import PlayerSetup from './pages/PlayerSetup'
import LiveGame from './pages/LiveGame'
import PastGames from './pages/PastGames'
import GameDetail from './pages/GameDetail'
import PointsManagement from './pages/PointsManagement'
import { useGameStore } from './store/useGameStore'
import { useEffect } from 'react'

export default function App() {
  const loadSamplePlayers = useGameStore(s=>s.loadSamplePlayers)
  useEffect(()=>{ loadSamplePlayers() },[])

  return (
    <div style={{maxWidth:960, margin:'0 auto'}}>
      <nav style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee', flexWrap:'wrap'}}>
        <Link to="/">主菜单</Link>
        <Link to="/setup">比赛设置</Link>
        <Link to="/live">实时比赛</Link>
        <Link to="/history">历史比赛</Link>
        <Link to="/points">积分管理</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MainMenu/>}/>
        <Route path="/setup" element={<PlayerSetup/>}/>
        <Route path="/live" element={<LiveGame/>}/>
        <Route path="/history" element={<PastGames/>}/>
        <Route path="/game/:id" element={<GameDetail/>}/>
        <Route path="/points" element={<PointsManagement/>}/>
      </Routes>
    </div>
  )
}
