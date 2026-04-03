import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWallet } from '../services/financeApi';

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getWallet();
      setWalletBalance(res.data.walletBalance);
      setTotalEarnings(res.data.totalEarnings);
      setRecentTx(res.data.transactions.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { name: 'Add Money', icon: '➕', path: '/finance/wallet', color: 'bg-green-500' },
    { name: 'Transfer', icon: '💸', path: '/finance/transfer', color: 'bg-blue-500' },
    { name: 'Recharge', icon: '📱', path: '/finance/recharge', color: 'bg-purple-500' },
    { name: 'Loans', icon: '🏦', path: '/finance/loans', color: 'bg-yellow-500' },
    { name: 'History', icon: '📜', path: '/finance/transactions', color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">💰 Finance Dashboard</h1>
          <button onClick={() => navigate('/services')} className="bg-orange-500 px-4 py-2 rounded-lg">Back</button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <p className="text-gray-300">Wallet Balance</p>
                <p className="text-4xl font-bold">₹{walletBalance.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <p className="text-gray-300">Total Earnings</p>
                <p className="text-4xl font-bold">₹{totalEarnings.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {actions.map((action) => (
                <Link key={action.name} to={action.path} className={`${action.color} hover:opacity-90 p-4 rounded-xl text-center transition`}>
                  <div className="text-2xl mb-1">{action.icon}</div>
                  <div className="text-sm">{action.name}</div>
                </Link>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              {recentTx.length === 0 ? (
                <p className="text-gray-300">No transactions yet</p>
              ) : (
                <div className="space-y-2">
                  {recentTx.map((tx) => (
                    <div key={tx._id} className="flex justify-between items-center border-b border-white/20 py-2">
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-xs text-gray-300">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                      <div className={tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}>
                        {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/finance/transactions" className="text-orange-400 text-sm mt-4 inline-block">View All →</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;