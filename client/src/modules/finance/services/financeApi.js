import api from '../../../config/api';

export const getWallet = () => api.get('/finance/wallet');
export const addMoney = (amount, paymentMethod) => api.post('/finance/add-money', { amount, paymentMethod });
export const transferMoney = (toEmail, amount, note) => api.post('/finance/transfer', { toEmail, amount, note });
export const recharge = (type, number, amount, operator) => api.post('/finance/recharge', { type, number, amount, operator });
export const applyLoan = (amount, tenure, purpose) => api.post('/finance/apply-loan', { amount, tenure, purpose });