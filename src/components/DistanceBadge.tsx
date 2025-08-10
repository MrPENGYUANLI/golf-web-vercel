export default function DistanceBadge({ meters }: { meters: number }) {
  return (
    <div style={{padding:'8px 12px', background:'#e7f5ff', borderRadius:8, display:'inline-flex', gap:8, alignItems:'center'}}>
      <span>📍</span>
      <b>距球洞：{Math.round(meters)} 米</b>
    </div>
  )
}
