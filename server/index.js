const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const data = require('./data');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Basic JSON schema validation using AJV
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

const createWithdrawalSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    accountId: { type: 'string' },
    amountCents: { type: 'integer', minimum: 1 }
  },
  required: ['accountId', 'amountCents'],
  additionalProperties: false
}

const topupSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    amountCents: { type: 'integer', minimum: 1 },
    description: { type: 'string' }
  },
  required: ['amountCents'],
  additionalProperties: false
}

const validateCreateWithdrawal = ajv.compile(createWithdrawalSchema)
const validateTopup = ajv.compile(topupSchema)

const PORT = process.env.PORT || 3333;

// Serve docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Admin: reset in-memory data to defaults (useful during development/tests)
app.post('/reset', (req, res) => {
  try {
    // reload fresh defaults
    const path = require.resolve('./data.default')
    // remove from cache to regenerate uuids if any
    delete require.cache[path]
    const fresh = require('./data.default')
    // mutate the existing data object in-place so references remain valid
    Object.keys(data).forEach(k => delete data[k])
    Object.assign(data, JSON.parse(JSON.stringify(fresh)))
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) })
  }
})

// GET /rewards
app.get('/rewards', (req, res) => {
  const user = data.USERS['user-1'];
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ balanceCents: user.balanceCents, currency: 'USD', history: data.HISTORY });
});

// GET /withdrawal-methods
app.get('/withdrawal-methods', (req, res) => {
  res.json(data.METHODS);
});

// GET /accounts?methodId=...
app.get('/accounts', (req, res) => {
  const { methodId } = req.query;
  const userId = 'user-1';
  let accounts = data.ACCOUNTS.filter(a => a.userId === userId);
  if (methodId) accounts = accounts.filter(a => a.methodId === methodId);
  res.json(accounts);
});

// POST /withdrawals
app.post('/withdrawals', (req, res) => {
  // validate body
  if (!validateCreateWithdrawal(req.body)) return res.status(400).json({ error: 'Invalid request', details: validateCreateWithdrawal.errors });
  const { userId, accountId, amountCents } = req.body;
  const uid = userId || 'user-1';
  const user = data.USERS[uid];
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const account = data.ACCOUNTS.find(a => a.id === accountId && a.userId === uid);
  if (!account) return res.status(400).json({ error: 'Cuenta no encontrada para el usuario' });
  if (amountCents <= 0) return res.status(400).json({ error: 'Monto inválido' });
  if (amountCents > user.balanceCents) return res.status(409).json({ error: 'Fondos insuficientes' });

  // create withdrawal
  const id = uuidv4();
  const withdrawal = { id, userId: uid, accountId, amountCents, status: 'processing', createdAt: new Date().toISOString() };
  data.WITHDRAWALS[id] = withdrawal;

  // adjust balance and push history (simulate immediate processing)
  user.balanceCents -= amountCents;
  data.HISTORY.unshift({ id: uuidv4(), type: 'withdraw', amountCents, date: new Date().toISOString(), description: `Retiro a ${account.label}` });

  withdrawal.status = 'completed';

  res.status(201).json(withdrawal);
});

// POST /topup - simulate adding funds to user balance
app.post('/topup', (req, res) => {
  // validate body
  if (!validateTopup(req.body)) return res.status(400).json({ error: 'Invalid request', details: validateTopup.errors });
  const { userId, amountCents, description } = req.body;
  const uid = userId || 'user-1';
  const user = data.USERS[uid];
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (!amountCents || amountCents <= 0) return res.status(400).json({ error: 'Monto inválido' });

  // adjust balance and push history
  user.balanceCents += amountCents;
  const entry = { id: uuidv4(), type: 'credit', amountCents, date: new Date().toISOString(), description: description || 'Recarga de saldo' };
  data.HISTORY.unshift(entry);

  res.status(201).json({ balanceCents: user.balanceCents, entry });
});

// GET /withdrawals/:id
app.get('/withdrawals/:id', (req, res) => {
  const w = data.WITHDRAWALS[req.params.id];
  if (!w) return res.status(404).json({ error: 'No encontrado' });
  res.json(w);
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
