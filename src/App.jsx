import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Host from "./assets/components/host/host";
import Manager from "./assets/components/Manager/manager";
import Login from "./assets/components/loginPage/Login";
import Waiter from './assets/components/waiter/waiter';
import Owner from './assets/components/owner/owner';
import LandingPage from './assets/components/landingPage/LandingPage';
import Chef from './assets/components/chef/chef';
import Admin from './assets/components/admin/admin';
import TableDashboard from './assets/components/customer/customerdash';
import Setting from './assets/components/settings/setting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/host" element={<Host />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/customerdash" element={<TableDashboard />} />
        <Route path="/waiter" element={<Waiter />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/chef" element={<Chef />} />
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/setting" element={<Setting />} />       
      </Routes>
    </Router>
  );
}

export default App;