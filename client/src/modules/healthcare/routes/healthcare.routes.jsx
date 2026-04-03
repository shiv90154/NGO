import { Route } from 'react-router-dom';
import HealthcareDashboard from '../pages/Dashboard';

const HealthcareRoutes = () => (
  <>
    <Route path="/healthcare/dashboard" element={<HealthcareDashboard />} />
  </>
);

export default HealthcareRoutes;