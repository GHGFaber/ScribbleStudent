import logo from '../react_images/scrib_emblem.png';

function Navbar({ classes }) {
  return (
      <nav>
        <div className="the-nav">
          <img className="scrib-emblem" src={logo} alt="Scribble-emblem"/>
          <ul className="nav-items my-auto">
            {
              classes.map((classInSchool, index) => (
                <li key={index}><label>{classInSchool.classInSchoolName}</label></li>
              ))
            }
          </ul>
          <button className="sign-out-button my-auto">Sign Out</button>
        </div>
      </nav>
  );
}

export default Navbar;

