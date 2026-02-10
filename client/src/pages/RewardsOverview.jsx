import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRewards } from '../api'
import { postTopup } from '../api'
import ArrowIcon from '../components/ArrowIcon'
import { useToast } from '../components/Toast'
import { FiSend, FiUserPlus } from 'react-icons/fi'
import { RiWallet3Line } from 'react-icons/ri'
import { FaPaypal } from 'react-icons/fa'
import { formatCentsDisplay } from '../utils/amount'

function groupByMonth(history){
  const groups = {}
  history.forEach(h => {
    const d = new Date(h.date)
    const key = d.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(h)
  })
  // create array of groups and sort by newest item date desc
  const arr = Object.keys(groups).map(k => ({ month: k, items: groups[k] }))
  arr.forEach(g => { g.maxTs = Math.max(...g.items.map(i => new Date(i.date).getTime())) })
  arr.sort((a,b)=> b.maxTs - a.maxTs)
  return arr
}

export default function RewardsOverview(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadOpen, setReloadOpen] = useState(false)
  const [topupValue, setTopupValue] = useState('')
  const nav = useNavigate()
  const toast = useToast()

  // data fetch
  useEffect(() => {
    getRewards()
      .then(r => { setData(r); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  // Swiper refs/state - MUST be declared unconditionally
  const rowRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    let raf = null
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const children = Array.from(row.children)
        if (!children.length) return
        const center = row.scrollLeft + row.offsetWidth / 2
        let nearest = 0
        let minDist = Infinity
        children.forEach((c, i) => {
          const cCenter = c.offsetLeft + c.offsetWidth / 2
          const dist = Math.abs(center - cCenter)
          if (dist < minDist) { minDist = dist; nearest = i }
        })
        setActiveIdx(nearest)
      })
    }
    row.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { row.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [data])

  if (loading) return <div className="muted">Cargando...</div>
  if (error) return <div className="error">Error: {error}</div>

  const groups = groupByMonth(data.history || [])

  const Icon = ({ type }) => {
    const size = 18
    const cls = 'icon-svg'
    if (type === 'paper-plane') return <FiSend size={size} className={cls} strokeWidth={1.8} />
    if (type === 'wallet') return <RiWallet3Line size={size} className={cls} />
    if (type === 'user-plus') return <FiUserPlus size={size} className={cls} strokeWidth={1.8} />
    if (type === 'paypal') return <FaPaypal size={size} className={cls} />
    return null
  }

  const scrollToIndex = (i) => {
    const row = rowRef.current
    if (!row) return
    const target = row.children[i]
    if (!target) return
    row.scrollTo({ left: target.offsetLeft - (row.offsetWidth - target.offsetWidth) / 2, behavior: 'smooth' })
  }


  return (
    <div>
      <h2>Rewards</h2>

      <div className="card" style={{marginTop:8}}>
        <div className="left">
          <div className="label">Monto acumulado</div>
          <div className="value">{formatCentsDisplay(data.balanceCents)}</div>
        </div>
        <div className="card cta" style={{border:'none',padding:0,background:'transparent'}}>
          <button className="primary" onClick={()=>nav('/withdraw/method')}>Retirar fondos <span className="btn-arrow"><ArrowIcon size={12} color="#fff" /></span></button>
        </div>
      </div>

      {/* floating reload button only on this screen */}
      <button className={`float-reload ${reloadOpen? 'open':''}`} title="Recargar" onClick={()=>setReloadOpen(true)} aria-label="Recargar saldo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* wallet box */}
          <rect x="2" y="7" width="16" height="10" rx="2" stroke="#fff" strokeWidth="1.4" fill="none"/>
          {/* wallet flap */}
          <path d="M6 7V5a1 1 0 011-1h8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* up arrow indicating top-up */}
          <path d="M18 9v6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.5 11.5L18 9l2.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {reloadOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h4>Recargar saldo</h4>
            <label className="muted">Monto a recargar</label>
            <input
              className="edit-amount-input"
              value={topupValue}
              onChange={e=>{
                // accept only numbers and format with commas as user types
                const raw = e.target.value.replace(/[^0-9]/g,'')
                if (raw === '') return setTopupValue('')
                const n = Number(raw)
                const withCommas = n.toLocaleString('en-US')
                setTopupValue(withCommas)
              }}
              placeholder="100.00"
              style={{width:'100%',marginTop:8,padding:10,borderRadius:8,border:'1px solid var(--card-border)'}}
            />
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
              <button className="btn secondary" onClick={()=>{ setReloadOpen(false); setTopupValue('') }}>Cancelar</button>
              <button className="btn primary" onClick={async ()=>{
                // parse topupValue (remove commas) and convert to cents
                const numeric = Number(String(topupValue).replace(/,/g,''))
                if (Number.isNaN(numeric) || numeric <= 0){ toast.show('Ingresa un monto válido','error'); return }
                const cents = Math.round(numeric*100)
                try{
                  await postTopup({ amountCents: cents })
                  const r = await getRewards()
                  setData(r)
                  setReloadOpen(false)
                  setTopupValue('')
                }catch(e){ toast.show('Error recargando','error') }
              }}>Recargar ahora</button>
            </div>
          </div>
        </div>
      )}

      <div style={{marginTop:20}}>
        <div className="months-row-container">
          <div className="months-row" ref={rowRef}>
            {groups.map(g => (
              <div className="month-card" key={g.month}>
                <div className="month-title">{g.month.charAt(0).toUpperCase()+g.month.slice(1)}</div>
                {g.items.map(h => (
                  <div key={h.id} className="tx-item">
                    <div className="tx-icon">
                      {(() => {
                        const desc = (h.description || '').toLowerCase()
                        if (desc.includes('paypal')) return <Icon type="paypal" />
                        if (desc.includes('retiro')) return <Icon type="paper-plane" />
                        if (desc.includes('cashback')) return <Icon type="wallet" />
                        if (desc.includes('bono') || desc.includes('referido')) return <Icon type="user-plus" />
                        return <Icon type="paper-plane" />
                      })()}
                    </div>
                    <div className="tx-body">
                      <div className="tx-title">{h.description}</div>
                      <div className="tx-date">{new Date(h.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div className={`tx-amount ${h.type==='credit'? 'in':'out'}`}>{(h.type==='credit'? '+':'-')}${(Math.abs(h.amountCents)/100).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {groups.length > 1 && (
          <div className="months-indicators" aria-hidden={false}>
            {groups.map((_, i) => (
              <button key={i} className={`month-dot ${i===activeIdx? 'active':''}`} onClick={() => scrollToIndex(i)} aria-label={`Ir a ${groups[i].month}`}></button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
