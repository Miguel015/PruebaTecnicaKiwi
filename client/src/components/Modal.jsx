import React from 'react'

export default function Modal({ open, title, children, onClose, showClose = false }){
  if (!open) return null
  return (
    <div style={{position:'fixed',left:0,top:0,right:0,bottom:0,background:'rgba(6,15,25,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:60}}>
      <div style={{width:'92%',maxWidth:420,background:'#fff',borderRadius:12,padding:18,boxShadow:'0 20px 40px rgba(2,6,23,0.18)'}}>
        {title && <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{title}</div>}
        <div>{children}</div>
        {showClose && (
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:14}}>
            <button onClick={onClose} style={{padding:'8px 12px',borderRadius:8,border:0,background:'#f1f5f9',cursor:'pointer'}}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  )
}
