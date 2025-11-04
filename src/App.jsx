import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Host from "./assets/components/host/host";
import Manager from "./assets/components/Manager/manager";
import Customerdash from './assets/components/customer/customerdash';
import LandingPage from "./assets/components/landingPage/landingPage";
import Login from "./assets/components/loginPage/Login";
import Signup from "./assets/components/signupPage/signup";
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
      </Routes>
    </Router>
  );
}

export default App;