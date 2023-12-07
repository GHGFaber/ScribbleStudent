import logo from '../react_images/scrib_emblem.png';

function Navbar() {
    return (
        <navbar>
          <nav className="the-nav">
            <img className="scrib-emblem" src={logo} alt="Scribble-emblem"/>
            <ul className="nav-items my-auto">
              <li>CHEM-101</li>
              <li>CS-206</li>
              <li>ENGL-200</li>
            </ul>
          </nav>
        </navbar>
    );
  }
export default Navbar;