import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getAccounts, createWithdrawal, getRewards } from '../api'
import ArrowIcon from '../components/ArrowIcon'
import BackButton from '../components/BackButton'
import Modal from '../components/Modal'
import { formatCentsDisplay, formatInputFromCents, parseAmountInput } from '../utils/amount'
import { useToast } from '../components/Toast'

// use utils for formatting

export default function WithdrawConfirm(){
  const [searchParams] = useSearchParams()
  const methodId = searchParams.get('methodId')
  const accountId = searchParams.get('accountId')
  const spAmount = searchParams.get('amountCents')
  let initial = null
  if (spAmount !== null){ const n = Number(spAmount); initial = Number.isNaN(n)? null : n }
  if (initial === null){ const saved = Number(localStorage.getItem('withdrawAmountCents')); initial = !Number.isNaN(saved)? saved : 1500 }

  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [amountCents, setAmountCents] = useState(initial)
  const [amountInput, setAmountInput] = useState('')
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const inputRef = useRef(null)
  const [amountError, setAmountError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const nav = useNavigate()
  const toast = useToast()

  useEffect(()=>{
    // determine accountId from query or selection
    let acctId = accountId
    try{ const s = JSON.parse(localStorage.getItem('selectedAccount')||'null'); if (!acctId && s) acctId = s.accountId }catch(e){}
    if (!acctId) return setAccount(null)
    getAccounts(methodId).then(list=> setAccount(list.find(a=>a.id===acctId) || null)).catch(()=>setAccount(null))
    getRewards().then(r=>setBalance(r.balanceCents)).catch(()=>setBalance(null))
  }, [methodId, accountId])

  useEffect(()=>{
    // initialize display input (dollars as integer with commas)
    try{
      if (typeof amountCents === 'number' && !Number.isNaN(amountCents)){
        setAmountInput(formatInputFromCents(amountCents))
      }else if (typeof balance === 'number' && !Number.isNaN(balance)){
        setAmountInput(formatInputFromCents(balance))
      }
    }catch(e){}
  }, [amountCents, balance])

  const handleAmountChangeRaw = (val) => {
    const parsed = parseAmountInput(val)
    setAmountInput(parsed.formatted)
    setAmountCents(parsed.cents)
    try{ 
      if (parsed.cents !== null) localStorage.setItem('withdrawAmountCents', String(parsed.cents)); else localStorage.removeItem('withdrawAmountCents')
    }catch(e){}
    // inline validation while typing
    if (parsed.cents === null) setAmountError('')
    else if (parsed.cents <= 0) setAmountError('Ingresa un monto mayor que 0')
    else if (balance !== null && parsed.cents > balance) setAmountError('No tienes fondos suficientes')
    else setAmountError('')
  }

  const handleSubmit = () => {
    setError(null)
    const amount = Number(amountCents)
    if (!amount || amount <= 0){ setErrorMsg('Ingrese un monto válido mayor que 0'); setErrorOpen(true); setAmountError('Ingresa un monto mayor que 0'); toast.show('Ingrese un monto válido mayor que 0','error'); return }
    if (balance !== null && amount > balance){ setErrorMsg('No tienes fondos suficientes para ese monto'); setErrorOpen(true); setAmountError('No tienes fondos suficientes'); toast.show('No tienes fondos suficientes para ese monto','error'); return }
    setConfirmOpen(true)
  }

  const confirm = () => {
    setConfirmOpen(false)
    setProcessing(true)
    const acctId = account?.id
    const amount = Number(amountCents)
    createWithdrawal({ userId: 'user-1', accountId: acctId, amountCents: amount }).then(w=>{
      setProcessing(false)
      localStorage.removeItem('selectedAccount')
      localStorage.removeItem('withdrawAmountCents')
      toast.show('Retiro creado correctamente','info')
      nav(`/withdraw/success?withdrawalId=${w.id}`)
    }).catch(e=>{ setProcessing(false); const msg = e.response?.data?.error || e.message; setError(msg); setErrorMsg(msg); setErrorOpen(true); toast.show(String(msg),'error') })
  }

  if (!account) return <div className="muted">Cargando cuenta...</div>

  return (
    <div>
      <BackButton onClick={()=>nav(-1)} />
      <h3>Retirar tus fondos</h3>

      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
        {!isEditingAmount ? (
          <div className="value" style={{margin:0}}>{formatCentsDisplay(amountCents)}</div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="edit-amount-input"
            value={amountInput}
            onChange={e=>handleAmountChangeRaw(e.target.value)}
            onBlur={()=>setIsEditingAmount(false)}
            style={{padding:8,borderRadius:8,border:'1px solid var(--card-border)',width:140}}
          />
        )}
        {amountError && <div className="error" style={{marginTop:8}}>{amountError}</div>}
        <button className="edit-icon" title={isEditingAmount? 'Guardar' : 'Editar monto'} onClick={()=>{ if (isEditingAmount) setIsEditingAmount(false); else { setIsEditingAmount(true); setTimeout(()=>inputRef.current?.focus(),50) } }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
        </button>
      </div>

      <div style={{marginTop:8,display:'flex',gap:10,alignItems:'center'}}>
        <div className="muted">Saldo: {balance!==null?formatCentsDisplay(balance) : '—'}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="method-card">
          <div>
            <div><strong>{account.label}</strong></div>
            <div className="muted">{account.maskedNumber}</div>
          </div>
          <div className="chevron"><ArrowIcon size={10} className="chev" /></div>
        </div>
      </div>

      <div className="note" style={{marginTop:12}}>
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

      {error && <div className="error">{error}</div>}

      <div className="footer-cta">
        <div className="footer-inner">
          <button className="footer-button primary" onClick={handleSubmit} disabled={processing}>
            {processing? <span className="spinner" aria-hidden="true"></span> : 'Retirar fondos'}
          </button>
        </div>
      </div>

      <Modal open={confirmOpen} title="Confirmar retiro" onClose={()=>setConfirmOpen(false)}>
        <div>Vas a retirar <strong>{formatCentsDisplay(amountCents)}</strong> a <strong>{account.label}</strong>.</div>
        <div className="modal-actions">
          <button className="btn secondary" onClick={()=>setConfirmOpen(false)}>Cancelar</button>
          <button className="btn primary" onClick={confirm}>Confirmar</button>
        </div>
      </Modal>

      <Modal open={errorOpen} title="Atención" onClose={()=>setErrorOpen(false)}>
        <div>{errorMsg}</div>
        <div className="modal-actions">
          <button className="btn primary" onClick={()=>setErrorOpen(false)}>OK</button>
        </div>
      </Modal>
    </div>
  )
}
