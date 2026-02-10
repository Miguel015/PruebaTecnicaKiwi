import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import RewardsOverview from './pages/RewardsOverview'
import SelectMethod from './pages/SelectMethod'
import SelectAccount from './pages/SelectAccount'
import WithdrawConfirm from './pages/WithdrawConfirm'
import WithdrawSuccess from './pages/WithdrawSuccess'

export default function App(){
  return (
    <div className="container">
      <header className="app-header">
        <div className="app-brand">
          <div className="app-logo" aria-hidden="true">
            <img src="https://media.licdn.com/dms/image/v2/D4E0BAQHLGpHk4ewzcg/company-logo_200_200/B4EZXdqH1mH0AQ-/0/1743180562220/kiwi_credito_logo?e=2147483647&v=beta&t=AbVDacw_4khn7MC66py_yPZJEEEE_GIDMvWEZv0OSY4" alt="Kiwi" className="app-logo-img" />
          </div>
          <div>
            <div className="app-title">Kiwi Demo</div>
            <div className="app-subtitle">Recompensas & Retiros — Demo</div>
          </div>
        </div>
      </header>
      <div className="content">
      <Routes>
        <Route path='/' element={<RewardsOverview/>} />
        <Route path='/withdraw/method' element={<SelectMethod/>} />
        <Route path='/withdraw/account' element={<SelectAccount/>} />
        <Route path='/withdraw/confirm' element={<WithdrawConfirm/>} />
        <Route path='/withdraw/success' element={<WithdrawSuccess/>} />
      </Routes>
      </div>
      <footer style={{ marginTop: 20 }} className="muted">&nbsp;</footer>
    </div>
  )
}
