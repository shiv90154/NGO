import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recharge } from '../services/financeApi';

const Recharge = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: 'mobile', number: '', amount: '', operator: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.number || !form.amount) return setMessage('Required fields missing');
    setLoading(true);
    try {
      const res = await recharge(form.type, form.number, form.amount, form.operator);
      setMessage('Recharge successful!');
      setTimeout(() => navigate('/finance/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Recharge failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Recharge & Bill Payment</h1>
        <form onSubmit={handleSubmit}>
          <select name="type" value={form.type} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4">
            <option value="mobile">Mobile Recharge</option>
            <option value="electricity">Electricity Bill</option>
            <option value="dth">DTH Recharge</option>
          </select>
          <input name="number" placeholder="Number / Consumer ID" value={form.number} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4" required />
          <input name="operator" placeholder="Operator (optional)" value={form.operator} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4" />
          <input name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} className="w-full p-3 rounded bg-white/20 mb-4" required />
          <button type="submit" disabled={loading} className="w-full bg-purple-500 py-2 rounded disabled:opacity-50">
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
        <button onClick={() => navigate(-1)} className="mt-4 text-gray-400 text-sm">← Back</button>
      </div>
    </div>
  );
};

export default Recharge;