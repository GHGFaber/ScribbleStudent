import logo from '../react_images/scrib_emblem.png';

function Navbar({classes}) {
    return (
        <navbar>
          <nav className="the-nav">
            <img className="scrib-emblem" src={logo} alt="Scribble-emblem"/>
            <ul className="nav-items my-auto">
              {
                classes.map(classInSchool => (
                  <li><label>{classInSchool.classInSchoolName}</label></li>
                ))
              }
            </ul>
            <button className="sign-out-button my-auto">Sign Out</button>
          </nav>
        </navbar>
    );
  }
export default Navbar;