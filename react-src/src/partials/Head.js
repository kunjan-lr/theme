import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../logo.svg";

function Head() {
  const [data, setData] = useState(null);
  const [logininfo, setLogininfo] = useState();

  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const fetchNavdata=()=>{   
      fetch("/wordpress/wp-json/wp/v2/menu")
      .then(res=>{return(res.json())})
      .then((data) => setData(data))
  }
  useEffect(() => {
    fetchNavdata()
    setLogininfo(JSON.parse(localStorage.getItem("customerinfo")))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>    
      <div className="cover bg-primary">
        <div className="container">
          <div className="row pb-2 pt-2">
            <div className="col-md-6 d-flex align-items-center">
              <p className="mb-0 phone pl-md-2">
                <Link to="" className="text-black text-decoration-none p-3">
                  <i className="fas fa-phone mr-1 phone-icon p-1"></i>+91 99 8523 4565
                </Link>
                <Link to="" className="text-black text-decoration-none">
                  <i className="fas fa-paper-plane mr-1 p-1"></i>info@gmail.com
                </Link>
              </p>
            </div>
            <div className="col-md-6 d-flex justify-content-md-end">              
              <div className="reg px-3 text-capitalize">
                {logininfo && logininfo['data'].user_login ?
                <> 
                Hello, <Link to={`wordpress/my-account`} className="text-black text-decoration-none px-1">{logininfo['data'].user_login}</Link> | <Link onClick={(e) => {window.localStorage.removeItem("customerinfo");window.location.href = "/wordpress/my-account"; }} className="text-black text-decoration-none px-1">Log out</Link>
                </>
                :
                <Link to={`wordpress/my-account`} className="text-black text-decoration-none px-1">Log In / Sign-Up</Link>
                }
              </div>
              <div className="social-icon mr-4">
                <p className="mb-0 d-flex">
                  <Link to="" className="text-black px-1">
                    <i className="fab fa-facebook"></i>
                  </Link> |
                  <Link to="" className="text-black px-1">
                    <i className="fab fa-instagram"></i>
                  </Link> |
                  <Link to="" className="text-black px-1">
                    <i className="fab fa-twitter"></i>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="navigation">
        <nav className="navbar navbar-expand navbar-dark bg-dark bg-color">
          <div className="container">
            <NavLink className="navbar-brand" to="/wordpress/">
              <img src={logo} alt="logo" width={100} />
            </NavLink>
            <div className="menu-icon" onClick={handleClick}>
              <i className={active ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
            <div>
              <ul className={active ? "nav-menu active" : "navbar-nav ml-auto"} >
              {data && data.map((item, i) => {

                const last = item.url.split("/");
                const val = i+1 === 1 ? 1 : '2';

                return (
                <li className="nav-item" key={i}>
                  <NavLink className="nav-link text-white" to={`wordpress/${last[last.length-val]}`}>
                    {item.title}
                  </NavLink>
                </li>
                )
              })}                
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
export default Head;
