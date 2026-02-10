import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getWithdrawal, getAccounts } from '../api'
import { formatCentsDisplay } from '../utils/amount'

export default function WithdrawSuccess(){
  const [searchParams] = useSearchParams()
  const id = searchParams.get('withdrawalId')
  const [w, setW] = useState(null)
  const [accountLabel, setAccountLabel] = useState('')

  useEffect(()=>{ if (id) getWithdrawal(id).then(d=>setW(d)).catch(()=>setW(null)) }, [id])

  useEffect(()=>{
    if (!w) return
    // try to resolve account label from server accounts
    getAccounts().then(list=>{
      const acc = list.find(a=>a.id === w.accountId)
      if (acc) setAccountLabel(acc.label || acc.maskedNumber || acc.id)
      else setAccountLabel(w.accountId)
    }).catch(()=>setAccountLabel(w.accountId))
  }, [w])

  if (!w) return <div className="muted">Cargando...</div>

  return (
    <div className="success-wrap">
      <div className="success-illustration" aria-hidden="true">
        {/* Inline SVG background with check */}
        <svg width="172" height="138" viewBox="0 0 172 138" fill="none" xmlns="http://www.w3.org/2000/svg" className="success-bg">
          <circle cx="87" cy="76" r="60" fill="#EEFBF2"/>
          <circle cx="87" cy="76" r="38" fill="#D7F4DE"/>
          <circle cx="118" cy="6" r="4" fill="#D7F4DE"/>
          <circle cx="162" cy="123" r="6" fill="#D7F4DE"/>
          <circle cx="163" cy="50" r="7" fill="#D7F4DE"/>
          <circle cx="10" cy="108" r="8" fill="#D7F4DE"/>
          <circle cx="20.5" cy="24.5" r="4.5" fill="#D7F4DE"/>
          <path d="M105.917 71.4167L102.25 67.75C101.583 67.0833 100.583 67.0833 99.9166 67.75L86.9999 80.6667L82.5833 76.25C81.9166 75.5833 80.9166 75.5833 80.2499 76.25L76.5833 79.9167C75.9166 80.5833 75.9166 81.5833 76.5833 82.25L85.8333 91.5C86.4999 92.1667 87.4999 92.1667 88.1666 91.5L105.917 73.75C106.5 73.1667 106.5 72.0833 105.917 71.4167Z" fill="#97DEB1"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M95.6995 63.5328C96.8543 62.378 98.6457 62.378 99.8006 63.5328L103.467 67.1995C104.622 68.3543 104.622 70.1457 103.467 71.3006L85.7172 89.0506C84.5624 90.2054 82.7709 90.2054 81.6161 89.0506L78.2828 85.7172C77.7946 85.2291 77.7946 84.4376 78.2828 83.9495C78.7709 83.4613 79.5624 83.4613 80.0506 83.9495L83.3839 87.2828C83.4903 87.3892 83.592 87.4167 83.6667 87.4167C83.7414 87.4167 83.8431 87.3892 83.9495 87.2828L101.699 69.5328C101.806 69.4264 101.833 69.3247 101.833 69.25C101.833 69.1753 101.806 69.0736 101.699 68.9672L98.0328 65.3006C97.9264 65.1942 97.8247 65.1667 97.75 65.1667C97.6753 65.1667 97.5736 65.1942 97.4672 65.3006L94.5506 68.2172C94.0624 68.7054 93.2709 68.7054 92.7828 68.2172C92.2946 67.7291 92.2946 66.9376 92.7828 66.4495L95.6995 63.5328Z" fill="#043960"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M91.2172 69.7828C91.7054 70.271 91.7054 71.0624 91.2172 71.5506L84.5506 78.2172C84.3161 78.4517 83.9982 78.5834 83.6667 78.5834C83.3351 78.5834 83.0172 78.4517 82.7828 78.2172L78.3661 73.8006C78.2597 73.6942 78.158 73.6667 78.0833 73.6667C78.0086 73.6667 77.9069 73.6942 77.8006 73.8006L74.1339 77.4672C74.0275 77.5736 74 77.6753 74 77.75C74 77.8247 74.0275 77.9264 74.1339 78.0328L76.8839 80.7828C77.372 81.271 77.372 82.0624 76.8839 82.5506C76.3957 83.0387 75.6043 83.0387 75.1161 82.5506L72.3661 79.8006C71.2113 78.6457 71.2113 76.8543 72.3661 75.6995L76.0328 72.0328C77.1876 70.878 78.9791 70.878 80.1339 72.0328L83.6667 75.5656L89.4495 69.7828C89.9376 69.2946 90.7291 69.2946 91.2172 69.7828Z" fill="#043960"/>
        </svg>
      </div>

      <h3 className="success-title">¡Tu retiro fue exitoso!</h3>
      <div className="success-desc">Procesamos tu solicitud y enviamos <strong>{formatCentsDisplay(w.amountCents)}</strong> a <strong>{accountLabel || w.accountId}</strong>.</div>

      <div className="note success-note" style={{marginTop:18}}>
        <div className="muted" style={{display:'flex',alignItems:'center',gap:12}}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{color:'var(--primary)'}}>
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
          <div><strong>El pago puede tardar hasta 3 días hábiles en reflejarse en tu cuenta.</strong></div>
        </div>
      </div>

      <div style={{marginTop:12, fontSize:13}} className="muted">
        <div style={{display:'flex',gap:12,alignItems:'center',justifyContent:'center'}}>
          <div>ID de retiro: <strong>{w.id}</strong></div>
          <button style={{padding:'6px 10px',borderRadius:8,border:'none',background:'var(--primary)',color:'#fff'}} onClick={()=>{navigator.clipboard?.writeText(w.id);}}>Copiar ID</button>
        </div>
      </div>

      <div className="footer-cta">
        <div className="footer-inner">
          <button className="footer-button primary" onClick={()=>window.location.href='/'}>Regresar a Rewards</button>
        </div>
      </div>
    </div>
  )
}
