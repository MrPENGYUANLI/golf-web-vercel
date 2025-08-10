import { useState } from 'react'
import { useGameStore } from '../store/useGameStore'

export default function PointsManagement() {
  const { totalPointsPool, deductionHistory, deductPoints } = useGameStore()
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  const deducted = deductionHistory.reduce((a,b)=>a+b.amount, 0)

  return (
    <div style={{padding:16, display:'grid', gap:16}}>
      <h2>积分管理</h2>

      <section>
        <h3>积分池状态</h3>
        <div>总积分：{totalPointsPool.toFixed(1)}</div>
        <div>已扣除积分：{deducted.toFixed(1)}</div>
      </section>

      <section>
        <h3>扣除积分</h3>
        <div style={{display:'flex', gap:8}}>
          <input placeholder="扣除数量" value={amount} onChange={e=>setAmount(e.target.value)} />
          <input placeholder="扣除原因" value={reason} onChange={e=>setReason(e.target.value)} />
          <button disabled={!amount || !reason} onClick={()=>{
            const v = parseFloat(amount)
            if (!isNaN(v) && v>0) {
              deductPoints(v, reason)
              setAmount(''); setReason('')
            }
          }}>确认扣除</button>
        </div>
      </section>

      <section>
        <h3>扣除历史</h3>
        <ul>
          {deductionHistory.map(d=>(
            <li key={d.id}>
              {new Date(d.date).toLocaleDateString()} - {d.amount.toFixed(1)} 分：{d.reason}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
