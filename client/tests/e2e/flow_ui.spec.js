const { test, expect } = require('@playwright/test')

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
  await waitForServer('http://localhost:5174/')
})

test('UI-driven: Rewards → Select method → Select account → Confirm → Success', async ({ page }) => {
  // Start from the app root
  await page.goto('/', { waitUntil: 'networkidle' })

  // Click primary withdraw button on RewardsOverview
  const withdrawBtn = page.getByRole('button', { name: /Retirar fondos/i })
  await withdrawBtn.waitFor({ timeout: 10000 })
  await withdrawBtn.click()

  // On SelectMethod, pick the first method card
  const methodCard = page.locator('.method-card').first()
  await methodCard.waitFor({ timeout: 10000 })
  await methodCard.click()

  // On SelectAccount, pick first account
  await page.waitForURL('**/withdraw/account**', { timeout: 5000 })
  const accountCard = page.locator('.account-card').first()
  await accountCard.waitFor({ timeout: 10000 })
  await accountCard.click()

  // Back on /withdraw/method, start withdraw (footer button)
  await page.waitForURL('**/withdraw/method**', { timeout: 5000 })
  const startBtn = page.getByRole('button', { name: /Retirar fondos/i })
  await startBtn.waitFor({ timeout: 10000 })
  await startBtn.click()

  // On Confirm page, ensure amount is valid (enable edit and set if needed), then open confirm modal and confirm
  await page.waitForURL('**/withdraw/confirm**', { timeout: 5000 })
  // enable editing amount to ensure validation passes
  const editIcon = page.locator('.edit-icon').first()
  if (await editIcon.count() > 0) {
    await editIcon.click()
    const amountInput = page.locator('.edit-amount-input').first()
    await amountInput.fill('10')
    await amountInput.press('Tab')
  }

  const confirmOpenBtn = page.getByRole('button', { name: /Retirar fondos/i })
  await confirmOpenBtn.waitFor({ timeout: 10000 })
  await confirmOpenBtn.click()
  const modalConfirm = page.getByRole('button', { name: /Confirmar/i })
  await modalConfirm.waitFor({ timeout: 10000 })
  await modalConfirm.click()

  // Expect success page
  await page.waitForURL('**/withdraw/success*', { timeout: 10000 })
  await expect(page.locator('.success-title')).toHaveText(/Tu retiro fue exitoso|¡Tu retiro fue exitoso!/i)
})
