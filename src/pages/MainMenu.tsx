import { Link } from 'react-router-dom'

export default function MainMenu() {
  return (
    <div style={{padding:24, display:'grid', gap:24}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:72}}>🏌️‍♂️</div>
        <h1>高尔夫比赛积分</h1>
      </div>
      <Link className="btn green" to="/setup">开始新比赛</Link>
      <Link className="btn blue" to="/history">历史比赛记录</Link>
      <Link className="btn orange" to="/points">积分管理</Link>
    </div>
  )
}
