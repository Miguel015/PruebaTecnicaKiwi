const base = 'http://localhost:3333'
async function run(){
  const r1 = await fetch(base + '/rewards').then(r=>r.json())
  console.log('REWARDS', r1)
  const methods = await fetch(base + '/withdrawal-methods').then(r=>r.json())
  console.log('METHODS', methods)
  const methodId = methods[0].id
  const accounts = await fetch(base + '/accounts?methodId='+methodId).then(r=>r.json())
  console.log('ACCOUNTS', accounts)
  const acct = accounts[0]
  const body = { userId: 'user-1', accountId: acct.id, amountCents: 1000 }
  const created = await fetch(base + '/withdrawals', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r=>({ status: r.status, body: r.json() }))
  created.body = await created.body
  console.log('CREATED', created)
  const id = created.body.id
  const fetched = await fetch(base + '/withdrawals/'+id).then(r=>r.json())
  console.log('FETCHED', fetched)
}

run().catch(e=>{ console.error('E2E ERROR', e); process.exit(1) })
