import { Route, Routes } from 'react-router-dom';
import AgricultureDashboard from '../pages/Dashboard';
import AgricultureProfile from '../pages/AgricultureProfile';
import CropGuide from '../pages/CropGuide';
import Orders from '../pages/Orders';
import DashboardHome from '../pages/DashboardHome';
const AgricultureRoutes = () => (

  <>
    <Routes>
      <Route path="/" element={<AgricultureDashboard />} />
      <Route path="/1/" element={<DashboardHome />} />
      <Route path="/profile/" element={<AgricultureProfile />} />

      <Route path="/crops/" element={<CropGuide />} />
      <Route path="/orders/" element={<Orders />} />
    </Routes>
  </>
);

export default AgricultureRoutes;