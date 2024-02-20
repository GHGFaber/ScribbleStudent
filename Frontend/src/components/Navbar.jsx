import logo from "../react_images/scrib_emblem.png";
import { useNavigate } from "react-router-dom";

function Navbar({ classes }) {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }
  return (
    <nav>
      <div className="the-nav">
        <img className="scrib-emblem" src={logo} alt="Scribble-emblem" />
        <ul className="nav-items my-auto">
          {classes.map((classInSchool, index) => (
            <li key={index}>
              <label>{classInSchool.className}</label>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="sign-out-button my-auto">
          Sign Out
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
