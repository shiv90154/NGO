import { Route } from 'react-router-dom';
import EducationDashboard from '../pages/Dashboard';

const EducationRoutes = () => (
  <>
    <Route path="/education/dashboard" element={<EducationDashboard />} />
    {/* add more education routes here */}
  </>
);

export default EducationRoutes;