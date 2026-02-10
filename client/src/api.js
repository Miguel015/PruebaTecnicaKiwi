import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3333' })

export const getRewards = () => api.get('/rewards').then(r => r.data)
export const getMethods = () => api.get('/withdrawal-methods').then(r => r.data)
export const getAccounts = (methodId) => api.get('/accounts', { params: { methodId } }).then(r => r.data)
export const createWithdrawal = (body) => api.post('/withdrawals', body).then(r => r.data)
export const getWithdrawal = (id) => api.get(`/withdrawals/${id}`).then(r => r.data)
export const postTopup = (payload) => api.post('/topup', payload).then(r => r.data)

export default api
