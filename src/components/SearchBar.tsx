import { useState } from 'react'

export default function SearchBar({
  onChange, placeholder
}: { onChange: (v: string) => void; placeholder?: string }) {
  const [v, setV] = useState('')
  return (
    <div style={{display:'flex', gap:8, alignItems:'center', background:'#f1f3f5', padding:8, borderRadius:8}}>
      <span>🔎</span>
      <input
        value={v}
        onChange={e => { setV(e.target.value); onChange(e.target.value) }}
        placeholder={placeholder ?? '搜索'}
        style={{ flex:1, border:'none', outline:'none', background:'transparent' }}
      />
      {v && <button onClick={() => { setV(''); onChange('') }}>✖</button>}
    </div>
  )
}
