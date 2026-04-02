import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyLoan } from '../services/financeApi';

const Loans = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: '', tenure: 12, purpose: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || form.amount <= 0) return setMessage('Enter valid amount');
    setLoading(true);
    try {
      const res = await applyLoan(form.amount, form.tenure, form.purpose);
      setMessage(`Loan approved! ₹${form.amount} credited to wallet.`);
      setTimeout(() => navigate('/finance/dashboard'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Loan application failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Apply for Loan / EMI</h1>
        <form onSubmit={handleSubmit}>
          <input name="amount" type="number" placeholder="Loan Amount (₹)" value={form.amount} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4" required />
          <select name="tenure" value={form.tenure} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4">
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
            <option value={24}>24 months</option>
          </select>
          <input name="purpose" placeholder="Purpose (e.g., Business, Education)" value={form.purpose} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4" />
          <button type="submit" disabled={loading} className="w-full bg-yellow-500 py-2 rounded disabled:opacity-50">
            {loading ? 'Processing...' : 'Apply Now'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
        <button onClick={() => navigate(-1)} className="mt-4 text-gray-400 text-sm">← Back</button>
      </div>
    </div>
  );
};

export default Loans;