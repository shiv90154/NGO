import { Route } from 'react-router-dom';
import AgricultureDashboard from '../pages/Dashboard';

const AgricultureRoutes = () => (
  <>
    <Route path="/agriculture/dashboard" element={<AgricultureDashboard />} />
  </>
);

export default AgricultureRoutes;