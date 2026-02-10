import React, { useEffect, useState, useRef } from 'react'
import { getMethods, getRewards } from '../api'
import { useNavigate } from 'react-router-dom'
import { RiWallet3Line } from 'react-icons/ri'
import { FaPaypal } from 'react-icons/fa'
import ArrowIcon from '../components/ArrowIcon'
import BackButton from '../components/BackButton'
import { FiRefreshCw } from 'react-icons/fi'
import { formatCentsDisplay, formatInputFromCents, parseAmountInput } from '../utils/amount'

export default function SelectMethod(){
  const [methods, setMethods] = useState([])
  const [rewards, setRewards] = useState(null)
  const [selected, setSelected] = useState(null)
  const [amountCents, setAmountCents] = useState(null)
  const [amountInput, setAmountInput] = useState('')
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const inputRef = useRef(null)
  const nav = useNavigate()

  useEffect(()=>{
    getMethods().then(m=>setMethods(m)).catch(()=>setMethods([]))
    getRewards().then(r=>setRewards(r)).catch(()=>setRewards(null))
    try{
      const s = JSON.parse(localStorage.getItem('selectedAccount')||'null')
      setSelected(s)
      if (s && typeof s.amountCents === 'number') setAmountCents(s.amountCents)
    }catch(e){setSelected(null)}
    // load persisted withdraw amount if exists
    try{
      const saved = Number(localStorage.getItem('withdrawAmountCents'))
      if (!Number.isNaN(saved)) setAmountCents(saved)
    }catch(e){}
    // initialize amountInput for editing (dollars, no decimals) based on amountCents or balance
    try{
      const init = !Number.isNaN(Number(localStorage.getItem('withdrawAmountCents'))) ? Number(localStorage.getItem('withdrawAmountCents')) : null
      const base = (typeof init === 'number' && !Number.isNaN(init)) ? init : (rewards && rewards.balanceCents ? rewards.balanceCents : null)
      if (base !== null) setAmountInput(formatInputFromCents(base))
    }catch(e){}
  }, [])

  const openAccounts = (methodId) => nav(`/withdraw/account?methodId=${methodId}`)

  const startWithdraw = () => {
    if (!selected) return
    // use current rewards balance (if available) as default amount to avoid submitting 0
    const amount = (typeof amountCents === 'number') ? amountCents : ((rewards && typeof rewards.balanceCents === 'number' && rewards.balanceCents > 0) ? rewards.balanceCents : 1500)
    nav(`/withdraw/confirm?methodId=${selected.methodId}&accountId=${selected.accountId}&amountCents=${amount}`)
  }

  const displayAmount = (typeof amountCents === 'number') ? formatCentsDisplay(amountCents) : (rewards && typeof rewards.balanceCents === 'number' ? formatCentsDisplay(rewards.balanceCents) : '$15.00')

  const reloadBalance = async () => {
    try{
      const r = await getRewards()
      setRewards(r)
      // if no explicit amount set, also update amountCents to reflect balance
      if (typeof amountCents !== 'number') setAmountCents(r.balanceCents)
    }catch(e){ /* ignore */ }
  }

  return (
    <div>
      <BackButton onClick={()=>nav(-1)} />
      <h3>Elige tu método de retiro</h3>
      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8,paddingBottom:'15px'}}>
        {!isEditingAmount ? (
          <div className="value" style={{margin:0}}>{displayAmount}</div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="edit-amount-input"
            value={amountInput}
            onChange={e=>{
              // accept only digits while typing and format with commas like recarga
              const raw = e.target.value.replace(/[^0-9]/g,'')
              if (raw === ''){ setAmountInput(''); setAmountCents(null); try{ localStorage.removeItem('withdrawAmountCents') }catch(e){}; return }
              const n = Number(raw)
              const withCommas = n.toLocaleString('en-US')
              setAmountInput(withCommas)
              const cents = Math.round(n*100)
              setAmountCents(cents)
              try{ localStorage.setItem('withdrawAmountCents', String(cents)) }catch(e){}
            }}
            onBlur={()=>setIsEditingAmount(false)}
            style={{padding:8,borderRadius:8,border:'1px solid var(--card-border)',width:140}}
          />
        )}
        <button className="edit-icon" onClick={()=>{ if (isEditingAmount){ setIsEditingAmount(false) } else { setIsEditingAmount(true); setTimeout(()=>inputRef.current?.focus(),50) } }} title={isEditingAmount? 'Guardar' : 'Editar monto'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
        </button>
      </div>

      {/* reload action removed from this screen - available only on Recompensas */}

      <div>
        {methods.map(m => (
            <div key={m.id} className={`method-card ${selected && selected.methodId===m.id ? 'selected' : ''}`} onClick={()=>openAccounts(m.id)} style={{cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div className="tx-icon" style={{width:36,height:36,borderRadius:18}}>
                {m.id === 'method-paypal' ? <FaPaypal size={18} /> : <RiWallet3Line size={18} />}
              </div>
              <div>
                <div><strong>{ selected && selected.methodId===m.id ? `Cuenta ${selected.maskedNumber || ''}` : 'Seleccionar' }</strong></div>
                <div className="muted">{m.description}</div>
              </div>
            </div>
            <div className="chevron"><ArrowIcon size={10} className="chev" /></div>
          </div>
        ))}
      </div>

      <div className="note" style={{marginTop:18}}>
        <div className="muted">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_631_138)">
                <path d="M18.6667 30C24.9259 30 30 24.9259 30 18.6666C30 12.4074 24.9259 7.33331 18.6667 7.33331C12.4075 7.33331 7.33337 12.4074 7.33337 18.6666C7.33337 24.9259 12.4075 30 18.6667 30Z" fill="#FFE082"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M13.4915 5.64104C14.3027 5.45384 15.159 5.33331 16 5.33331C21.9144 5.33331 26.6667 10.0856 26.6667 16C26.6667 19.7835 24.7149 23.1345 21.732 25.0216C21.2653 25.3168 21.1263 25.9346 21.4216 26.4013C21.7169 26.868 22.3346 27.007 22.8013 26.7117C26.3518 24.4655 28.6667 20.4831 28.6667 16C28.6667 8.98103 23.0189 3.33331 16 3.33331C14.9743 3.33331 13.964 3.47945 13.0418 3.69226C12.5037 3.81644 12.1681 4.35336 12.2923 4.89151C12.4165 5.42965 12.9534 5.76522 13.4915 5.64104ZM8.49579 8.45154C8.89247 8.06726 8.90252 7.43418 8.51824 7.0375C8.13396 6.64083 7.50088 6.63078 7.1042 7.01506C4.78088 9.26578 3.33333 12.4564 3.33333 16C3.33333 23.0189 8.98105 28.6666 16 28.6666H16.2667C16.8189 28.6666 17.2667 28.2189 17.2667 27.6666C17.2667 27.1143 16.8189 26.6666 16.2667 26.6666H16C10.0856 26.6666 5.33333 21.9143 5.33333 16C5.33333 13.0102 6.55245 10.3341 8.49579 8.45154ZM16 9.99998C16.5523 9.99998 17 10.4477 17 11V17C17 17.5523 16.5523 18 16 18C15.4477 18 15 17.5523 15 17V11C15 10.4477 15.4477 9.99998 16 9.99998ZM17.3333 20.6666C17.3333 21.403 16.7364 22 16 22C15.2636 22 14.6667 21.403 14.6667 20.6666C14.6667 19.9303 15.2636 19.3333 16 19.3333C16.7364 19.3333 17.3333 19.9303 17.3333 20.6666ZM2.28446 9.86365C2.80158 10.0576 3.06358 10.634 2.86966 11.1511C2.31114 12.6405 2 14.255 2 16C2 17.745 2.31114 19.3595 2.86966 20.8489C3.06358 21.366 2.80158 21.9424 2.28446 22.1363C1.76734 22.3302 1.19092 22.0682 0.997004 21.5511C0.355528 19.8405 0 17.9883 0 16C0 14.0116 0.355528 12.1595 0.997004 10.4489C1.19092 9.93173 1.76734 9.66972 2.28446 9.86365ZM31.003 10.4489C30.8091 9.93173 30.2327 9.66972 29.7156 9.86365C29.1984 10.0576 28.9364 10.634 29.1303 11.1511C29.6881 12.6384 30 14.3194 30 16C30 17.6806 29.6881 19.3616 29.1303 20.8489C28.9364 21.366 29.1984 21.9424 29.7156 22.1363C30.2327 22.3302 30.8091 22.0682 31.003 21.5511C31.6453 19.8384 32 17.9194 32 16C32 14.0806 31.6453 12.1616 31.003 10.4489Z" fill="#043960"/>
                </g>
                <defs>
                <clipPath id="clip0_631_138">
                <rect width="32" height="32" fill="white"/>
                </clipPath>
                </defs>
            </svg>
            *Debes esperar unos minutos antes de realizar otro retiro con el mismo monto.</div>
      </div>

      <div className="footer-cta">
        <div className="footer-inner">
          <button className="footer-button primary" onClick={startWithdraw} disabled={!selected} style={{opacity: (!selected?0.6:1)}}>Retirar fondos</button>
        </div>
      </div>
    </div>
  )
}
