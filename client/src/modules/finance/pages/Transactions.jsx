import React, { useState, useEffect } from 'react';
import { getWallet } from '../services/financeApi';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getWallet();
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <div className="bg-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/20">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-t border-white/10">
                    <td className="p-3">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">{tx.description}</td>
                    <td className={`p-3 ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                    </td>
                    <td className="p-3 capitalize">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button onClick={() => window.history.back()} className="mt-6 text-gray-400 text-sm">← Back</button>
      </div>
    </div>
  );
};

export default Transactions;