import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const flagIcon = new L.DivIcon({ html: '🚩', className: 'flag', iconSize: [24,24] })
const personIcon = new L.DivIcon({ html: '🧍', className: 'person', iconSize: [24,24] })

export default function CourseMap({
  pin, tees, players
}: {
  pin: [number, number]
  tees: [number, number][]
  players: [number, number][]
}) {
  const center = pin
  return (
    <div style={{height:300, border:'2px solid #37b24d', borderRadius:8, overflow:'hidden'}}>
      <MapContainer center={center} zoom={16} style={{height:'100%', width:'100%'}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <Marker position={pin} icon={flagIcon}><Popup>旗杆</Popup></Marker>
        {tees.map((t,i)=>(
          <CircleMarker key={i} center={t} radius={6} pathOptions={{color:'#37b24d'}}/>
        ))}
        {players.map((p,i)=>(
          <Marker key={i} position={p} icon={personIcon}/>
        ))}
      </MapContainer>
    </div>
  )
}
