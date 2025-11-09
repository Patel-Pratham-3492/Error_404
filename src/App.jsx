import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Host from "./assets/components/host/host";
import Manager from "./assets/components/Manager/manager";
import Customerdash from './assets/components/customer/customerdash';
import Login from "./assets/components/loginPage/Login";
import Signup from "./assets/components/signupPage/signup";
import Waiter from './assets/components/waiter/waiter';
import Owner from './assets/components/owner/owner';
import LandingPage from './assets/components/landingPage/LandingPage';
import Chefs from './assets/components/chefs/chefs';
// import SignupManager from "./assets/components/signupPage/signup-manager";
// import SignupStaff from "./assets/components/signupPage/signup-staff";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/host" element={<Host />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/customerdash" element={<Customerdash />} />
        <Route path="/waiter" element={<Waiter />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/chefs" element={<Chefs />} />
                
      </Routes>
    </Router>
  );
}

export default App;