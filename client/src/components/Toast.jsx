import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'info', ttl = 4000) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2,7)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ttl)
  }, [])

  const value = { show }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{position:'fixed',right:18,top:18,display:'flex',flexDirection:'column',gap:8,zIndex:100}}>
        {toasts.map(t => (
          <div key={t.id} style={{background: t.type==='error'? '#fee2e2' : '#eef4ff', color: t.type==='error'? '#991b1b' : '#062e4a', padding: '10px 14px', borderRadius:10, boxShadow:'0 6px 20px rgba(2,6,23,0.12)'}}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider
