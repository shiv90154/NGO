import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transferMoney } from '../services/financeApi';

const Transfer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ toEmail: '', amount: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.toEmail || !form.amount) return setMessage('All fields required');
    setLoading(true);
    try {
      const res = await transferMoney(form.toEmail, form.amount, form.note);
      setMessage('Transfer successful!');
      setTimeout(() => navigate('/finance/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Money Transfer</h1>
        <form onSubmit={handleSubmit}>
          <input name="toEmail" placeholder="Receiver's Email" value={form.toEmail} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4" required />
          <input name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4" required />
          <input name="note" placeholder="Optional note" value={form.note} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4" />
          <button type="submit" disabled={loading} className="w-full bg-blue-500 py-2 rounded disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Money'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
        <button onClick={() => navigate(-1)} className="mt-4 text-gray-400 text-sm">← Back</button>
      </div>
    </div>
  );
};

export default Transfer;