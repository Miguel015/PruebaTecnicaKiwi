export function formatCentsDisplay(cents){
  if (cents === null || cents === undefined) return '$0.00'
  return `$${(cents/100).toFixed(2)}`
}

export function formatInputFromCents(cents){
  if (cents === null || cents === undefined) return ''
  try{ return String(Math.floor(cents/100)).replace(/\B(?=(\d{3})+(?!\d))/g,',') }catch(e){ return '' }
}

// Parse a raw input value (user typing) and return { cents, formatted }
export function parseAmountInput(raw){
  const digits = String(raw || '').replace(/[^0-9]/g,'')
  if (digits === '') return { cents: null, formatted: '' }
  const n = Number(digits)
  const withCommas = n.toLocaleString('en-US')
  const cents = Math.round(n*100)
  return { cents, formatted: withCommas }
}

export default { formatCentsDisplay, formatInputFromCents, parseAmountInput }
