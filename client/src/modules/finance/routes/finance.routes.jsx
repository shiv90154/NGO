import { Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Wallet from '../pages/Wallet';
import Transfer from '../pages/Transfer';
import Recharge from '../pages/Recharge';
import Loans from '../pages/Loans';
import Transactions from '../pages/Transactions';

const FinanceRoutes = () => (
  <>
    <Route path="/finance/dashboard" element={<Dashboard />} />
    <Route path="/finance/wallet" element={<Wallet />} />
    <Route path="/finance/transfer" element={<Transfer />} />
    <Route path="/finance/recharge" element={<Recharge />} />
    <Route path="/finance/loans" element={<Loans />} />
    <Route path="/finance/transactions" element={<Transactions />} />
  </>
);

export default FinanceRoutes;