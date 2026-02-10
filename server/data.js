const { v4: uuidv4 } = require('uuid');

const USERS = {
  'user-1': {
    id: 'user-1',
    name: 'Demo User',
    balanceCents: 1500 // $15.00 for demo
  }
};

const HISTORY = [
  // February 2026 - more demo items to show a filled swiper
  { id: uuidv4(), type: 'debit', amountCents: -1200, date: '2026-02-09T14:00:00.000Z', description: 'Retiro a PayPal - demo@user.com' },
  { id: uuidv4(), type: 'debit', amountCents: -800, date: '2026-02-08T10:30:00.000Z', description: 'Retiro a Cuenta Ahorros - Banco X' },
  { id: uuidv4(), type: 'credit', amountCents: 300, date: '2026-02-05T09:20:00.000Z', description: 'Cashback' },
  { id: uuidv4(), type: 'credit', amountCents: 1500, date: '2026-02-02T11:15:00.000Z', description: 'Promotional reward' },

  // January 2026
  { id: uuidv4(), type: 'credit', amountCents: 1500, date: '2026-01-28T10:15:00.000Z', description: 'Bono de fin de mes' },
  { id: uuidv4(), type: 'debit', amountCents: -1200, date: '2026-01-20T14:30:00.000Z', description: 'Retiro a PayPal' },
  { id: uuidv4(), type: 'credit', amountCents: 300, date: '2026-01-12T09:00:00.000Z', description: 'Cashback' },

  // December 2025
  { id: uuidv4(), type: 'credit', amountCents: 1500, date: '2025-12-22T11:10:00.000Z', description: 'Bono de temporada' },
  { id: uuidv4(), type: 'debit', amountCents: -500, date: '2025-12-05T16:40:00.000Z', description: 'Retiro a cuenta' },

  // September
  { id: uuidv4(), type: 'debit', amountCents: -1500, date: '2025-09-20T12:00:00.000Z', description: 'Retiro a cuenta' },
  { id: uuidv4(), type: 'credit', amountCents: 1500, date: '2025-09-18T09:30:00.000Z', description: 'Bono de referido' },
  { id: uuidv4(), type: 'credit', amountCents: 200, date: '2025-09-10T08:00:00.000Z', description: 'Cashback' },

  // August
  { id: uuidv4(), type: 'debit', amountCents: -1500, date: '2025-08-13T14:20:00.000Z', description: 'Retiro a ATH Móvil' },
  { id: uuidv4(), type: 'credit', amountCents: 1500, date: '2025-08-05T10:30:00.000Z', description: 'Bono de referido' },

  // July
  { id: uuidv4(), type: 'credit', amountCents: 1500, date: '2025-07-18T11:05:00.000Z', description: 'Cashback' },
  { id: uuidv4(), type: 'credit', amountCents: 1500, date: '2025-07-12T08:45:00.000Z', description: 'Bono de referido' },
  { id: uuidv4(), type: 'debit', amountCents: -500, date: '2025-07-02T09:20:00.000Z', description: 'Compra - Tienda' },

  // June
  { id: uuidv4(), type: 'credit', amountCents: 500, date: '2025-06-02T10:00:00.000Z', description: 'Ajuste de cuenta' },
  { id: uuidv4(), type: 'credit', amountCents: 1200, date: '2025-06-18T13:40:00.000Z', description: 'Cashback' },

  // May
  { id: uuidv4(), type: 'credit', amountCents: 1500, date: '2025-05-25T16:10:00.000Z', description: 'Bono promocional' },
  { id: uuidv4(), type: 'debit', amountCents: -800, date: '2025-05-10T12:00:00.000Z', description: 'Retiro a cuenta' }
];

const METHODS = [
  { id: 'method-bank', name: 'Cuenta bancaria', description: 'Transferencia a cuenta bancaria' },
  { id: 'method-paypal', name: 'PayPal', description: 'Enviar a PayPal' }
];

const ACCOUNTS = [
  { id: 'acc-1', userId: 'user-1', methodId: 'method-bank', label: 'Cuenta Ahorros - Banco X', maskedNumber: '****1234' },
  { id: 'acc-2', userId: 'user-1', methodId: 'method-paypal', label: 'PayPal - demo@user.com', maskedNumber: 'demo@user.com' }
];

const WITHDRAWALS = {};

module.exports = {
  USERS,
  HISTORY,
  METHODS,
  ACCOUNTS,
  WITHDRAWALS
};
