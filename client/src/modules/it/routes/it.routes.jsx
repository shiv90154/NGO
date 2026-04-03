import { Route } from 'react-router-dom';
import ITDashboard from '../pages/Dashboard';

const ITRoutes = () => (
  <>
    <Route path="/it/dashboard" element={<ITDashboard />} />
  </>
);

export default ITRoutes;