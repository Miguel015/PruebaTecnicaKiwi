const { test, expect } = require('@playwright/test')

// wait for the Vite dev server to be ready
async function waitForServer(url, timeout = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { method: 'GET' })
      if (res.ok) return
    } catch (e) {}
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error('Dev server did not become ready: ' + url)
}

test.beforeAll(async () => {
  await waitForServer('http://localhost:5173/')
})

test('Rewards → Retiro → Éxito flow', async ({ page }) => {
  // Seed localStorage with a valid selected account and amount, then open confirm
  await page.addInitScript(() => {
    try{
      localStorage.setItem('selectedAccount', JSON.stringify({ accountId: 'acc-1', label: 'Cuenta Ahorros - Banco X', maskedNumber: '****1234', methodId: 'method-bank', amountCents: 1500 }))
      localStorage.setItem('withdrawAmountCents', String(1500))
    }catch(e){}
  })

  await page.goto('/withdraw/confirm', { waitUntil: 'load' })

  // Open confirm modal and confirm
  const confirmBtn = page.getByRole('button', { name: /Retirar fondos/i })
  await confirmBtn.waitFor({ timeout: 10000 })
  await confirmBtn.click()
  const modalConfirm = page.getByRole('button', { name: /Confirmar/i })
  await modalConfirm.waitFor({ timeout: 10000 })
  await modalConfirm.click()

  // Expect success page
  await page.waitForURL('**/withdraw/success*', { timeout: 10000 })
  await expect(page.locator('.success-title')).toHaveText(/Tu retiro fue exitoso|¡Tu retiro fue exitoso!/i)
})
