import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getAccounts, getRewards } from '../api'
import ArrowIcon from '../components/ArrowIcon'
import BackButton from '../components/BackButton'
import InfoIcon from '../components/InfoIcon'
import { RiWallet3Line } from 'react-icons/ri'
import { FaPaypal } from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import { formatCentsDisplay, formatInputFromCents, parseAmountInput } from '../utils/amount'

export default function SelectAccount(){
  const [searchParams] = useSearchParams()
  const methodId = searchParams.get('methodId')
  const [accounts, setAccounts] = useState([])
  const [balance, setBalance] = useState(0)
  const [amountCents, setAmountCents] = useState(null)
  const [amountInput, setAmountInput] = useState('')
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const inputRef = React.useRef(null)
  const nav = useNavigate()

  useEffect(()=>{
    getAccounts(methodId).then(a=>setAccounts(a)).catch(()=>setAccounts([]))
    getRewards().then(r=>setBalance(r.balanceCents)).catch(()=>setBalance(1500))
    try{ const s = JSON.parse(localStorage.getItem('selectedAccount')||'null'); if (s && typeof s.amountCents === 'number') setAmountCents(s.amountCents) }catch(e){}
    try{ const saved = Number(localStorage.getItem('withdrawAmountCents')); if (!Number.isNaN(saved)) setAmountCents(saved) }catch(e){}
    // init amountInput from amountCents or balance (dollars, integer)
    try{
      const init = Number(localStorage.getItem('withdrawAmountCents'))
      const base = !Number.isNaN(init) ? init : (balance || null)
      if (base !== null) setAmountInput(formatInputFromCents(base))
    }catch(e){}
  }, [methodId])

  const reloadBalance = async () => {
    try{ const r = await getRewards(); setBalance(r.balanceCents) }catch(e){}
  }

  const pick = (a) => {
    // persist selection and return to method screen
    localStorage.setItem('selectedAccount', JSON.stringify({ accountId: a.id, label: a.label, maskedNumber: a.maskedNumber, methodId, amountCents: (typeof amountCents==='number'?amountCents:balance) }))
    nav('/withdraw/method')
  }

  return (
    <div>
      <BackButton onClick={()=>nav(-1)} />
      <h3>Selecciona tu cuenta</h3>
      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
        {!isEditingAmount ? (
          <div className="value" style={{margin:0}}>{formatCentsDisplay((typeof amountCents==='number') ? amountCents : balance)}</div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="edit-amount-input"
            value={amountInput}
            onChange={e=>{
              const parsed = parseAmountInput(e.target.value)
              setAmountInput(parsed.formatted)
              setAmountCents(parsed.cents)
              try{ if (parsed.cents !== null) localStorage.setItem('withdrawAmountCents', String(parsed.cents)); else localStorage.removeItem('withdrawAmountCents') }catch(e){}
            }}
            onBlur={()=>setIsEditingAmount(false)}
            style={{padding:8,borderRadius:8,border:'1px solid var(--card-border)',width:140}}
          />
        )}
        <button className="edit-icon" onClick={()=>{ if (isEditingAmount){ setIsEditingAmount(false) } else { setIsEditingAmount(true); setTimeout(()=>inputRef.current?.focus(),50) } }} title={isEditingAmount? 'Guardar' : 'Editar monto'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        {accounts.map(a => (
          <div key={a.id} className={`account-card`} onClick={()=>pick(a)} style={{cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div className="tx-icon" style={{width:36,height:36,borderRadius:18}}>
                {a.methodId === 'method-paypal' ? <FaPaypal size={18} /> : <RiWallet3Line size={18} />}
              </div>
              <div>
                <div>{a.label}</div>
                <div className="muted">{a.maskedNumber}</div>
              </div>
            </div>
            <div className="chevron"><ArrowIcon size={10} className="chev" /></div>
          </div>
        ))}
      </div>

      <div className="note" style={{marginTop:18}}>
        <div className="muted" style={{display:'flex',alignItems:'center',gap:12}}>
          <InfoIcon size={28} className="note-icon" />
          <div><strong>Debes esperar unos minutos</strong> antes de realizar otro retiro con el mismo monto.</div>
        </div>
      </div>

    </div>
  )
}
