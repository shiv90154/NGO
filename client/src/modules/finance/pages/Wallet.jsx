import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMoney } from '../services/financeApi';

const Wallet = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return setMessage('Enter valid amount');
    setLoading(true);
    try {
      const res = await addMoney(amount, method);
      setMessage(`Success! New balance: ₹${res.data.walletBalance}`);
      setAmount('');
      setTimeout(() => navigate('/finance/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Add money failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Add Money to Wallet</h1>
        <form onSubmit={handleSubmit}>
          <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 rounded bg-white/20 mb-4" required />
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-3 rounded bg-white/20 mb-4">
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="netbanking">Net Banking</option>
          </select>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 py-2 rounded disabled:opacity-50">
            {loading ? 'Processing...' : 'Add Money'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
        <button onClick={() => navigate(-1)} className="mt-4 text-gray-400 text-sm">← Back</button>
      </div>
    </div>
  );
};

export default Wallet;