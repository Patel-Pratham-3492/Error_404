import "./Intro.css";
import { Link } from "react-router-dom";

const Intro = () => {
  return (
    <section className="intro d-flex flex-column justify-content-center align-items-center text-center" id="home">
      <div className="logo-title">
        <span className="gg">G</span>
        <span className="gg second">G</span>
      </div>

      <h1 className="intro-title mt-3">Grill Genius</h1>

      <p className="intro-desc mt-3">
        Welcome to <strong>Grill Genius</strong> — where sizzling flavors meet creativity.  
        Enjoy perfectly grilled delights, crafted with passion and served fresh every time.
      </p>

      <div className="intro-buttons mt-4 ms-2">
         <Link to="/login" className="btn btn-order me-3">Login</Link>
      </div>
    </section>
  );
};

export default Intro;
