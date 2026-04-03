import { Route } from 'react-router-dom';
import FinanceDashboard from '../pages/Dashboard';

const FinanceRoutes = () => (
  <>
    <Route path="/finance/dashboard" element={<FinanceDashboard />} />
  </>
);

export default FinanceRoutes;