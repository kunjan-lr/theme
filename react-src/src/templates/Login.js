import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import ReactPaginate from 'react-paginate';
import moment from "moment";

const api = new WooCommerceRestApi({
    url: process.env.REACT_APP_API_BASE_URL,
    consumerKey: process.env.REACT_APP_API_CONSUMERKEY,
    consumerSecret: process.env.REACT_APP_API_CONSUMERSECRET,
    version: process.env.REACT_APP_API_VERSION
});

// function Userinfo() {
    // const logindata = JSON.parse(localStorage.getItem("customerinfo"));
// }

function Login() {
const [logininfo, setLogininfo] = useState(JSON.parse(localStorage.getItem("customerinfo")));
const [tokon, setToken] = useState();
const [userdata, setUserdata] = useState();
const [registerinfo, setRegisterinfo] = useState();

const [orders, setOrders] = useState([]);
const [pageCount, setPageCount] = useState(0);
const [page, setpage] = useState(1)

  const handleOnSubmit = (e) => {
    e.preventDefault();

        const { target } = e;
        let userinfo = Object.fromEntries(new FormData(target));

        const requestData = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "admin", password: "admin123" }),
        };
  
        fetch("/wordpress/wp-json/jwt-auth/v1/token", requestData)
        .then((response) => response.json())
        .then((data) => setToken(data)).catch(e=>console.log(e));
  
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            Authorizatiocustomerinfon: tokon,
            body: JSON.stringify(userinfo),
        };
        fetch("/wordpress/wp-json/custom-api/login", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            setLogininfo(data) 
            localStorage.setItem('customerinfo', JSON.stringify(data))
            Swal.fire({
                icon: 'success',
                title: 'Login Successfully'
            })
        }).catch((error) => {
            console.log(error);
        });
  }

  useEffect(() => {    
    setUserdata(JSON.parse(window.localStorage.getItem("customerinfo")))
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logininfo, page]);

  const handleOnSubmitregister = (e) => {
    e.preventDefault();

    const { target } = e;
        let userinfo = Object.fromEntries(new FormData(target));

        const requestData = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "admin", password: "admin123" }),
        };
  
        fetch("/wordpress/wp-json/jwt-auth/v1/token",
            requestData
        )
        .then((response) => response.json())
        .then((data) => setToken(data)).catch(e=>console.log(e));
  
        const registerOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            Authorizatiocustomerinfon: tokon,
            body: JSON.stringify(userinfo),
        };

        fetch("/wordpress/wp-json/wp/v2/users/register", registerOptions)
        .then((response) => response.json())
        .then((data) => {
        setRegisterinfo(data)      
            Swal.fire({
            icon: 'success',
            title: 'Registration was Successful'
            })      
        })
        .catch((error) => {
            console.log(error);
        });
  }
  
  const fetchOrders = () => {
    api.get(`orders?customer=${logininfo ? logininfo['data'].ID : null}`,{
        per_page: 5,
        page: page
    }).then((response) => {                
        if (response.status === 200) {
            setOrders(response.data);
            setPageCount(response.headers['x-wp-totalpages'])
        }
    })
  }

  return (
    <>
    <section className="default-page mb-5">
            <div className="container">
                <h1 className="text-center pb-5">My account</h1>
                {userdata ? (
                    <>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="dashboard">
                    <Row>
                        <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="orders">Orders</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </Col>
                        <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="dashboard">
                                Hello {userdata['data'].user_login} (not {userdata['data'].user_login} ? <Link onClick={(e) => {window.localStorage.removeItem("customerinfo");window.location.href = "/wordpress/my-account"; }} >{" "}Log out</Link>)
                                From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
                            </Tab.Pane>
                            <Tab.Pane eventKey="orders">
                                <h4>Orders</h4>
                                <table className="table table-striped table-hover table-bordered">
                                    <thead>
                                        <tr className="table-primary">
                                            <th>Order</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders && orders.map((order, index) => {     
                                            let txt = ''
                                            if(order.line_items.length > 1){
                                                txt = 'items'
                                            }else{
                                                txt = 'item'
                                            }                              
                                            return (
                                                <tr key={index}>
                                                    <td>#{order.id}</td>
                                                    <td>{moment(order.date_created).format("MMM D, Y")}</td>
                                                    <td className='text-capitalize'>{order.status}</td>
                                                    <td><span className="woocommerce-Price-currencySymbol">$</span>{order.total} for {order.line_items.length +' '+txt}</td>
                                                    <td><Link to= {`view-order/${order.id}`} className='ui green button btn btn-primary'>View</Link></td>
                                                </tr>
                                            );                                            
                                        })}
                                    </tbody>
                                </table>
                                <ReactPaginate        
                                    nextLabel="Next >"
                                    onPageChange={(e)=>{setpage(e.selected+1)}}
                                    pageRangeDisplayed={5}
                                    marginPagesDisplayed={2}
                                    pageCount={pageCount}
                                    previousLabel="< Previous"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakLabel="..."
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                    renderOnZeroPageCount={null}
                                />
                            </Tab.Pane>
                        </Tab.Content>
                        </Col>
                    </Row>
                    </Tab.Container>
                    </>
                ) : (
                <div className="row">
                    <div className="col-lg-6">
                        <h1>Login</h1>
                        <form onSubmit={handleOnSubmit} autoComplete="off">
                            <div className="pb-3">
                                <label>Username or email address *</label>
                                <input name="username" className="form-control" placeholder="Username or email address" required />
                            </div>
                            <div className="pb-3">
                                <label>Password *</label>
                                <input type="password" name="password" className="form-control" placeholder="Password" required />
                            </div>
                            <div className="contact-button pb-3">
                                <button type="submit" className="mt-2 btn btn-primary">
                                    Log in
                                </button>
                            </div>
                            <p className="lost-password">
                                Lost your password?
                            </p>
                        </form>
                    </div>
                    <div className="col-lg-6">                    
                        <h1>Register</h1>
                        {registerinfo?.message ? registerinfo.message :
                        <form onSubmit={handleOnSubmitregister} autoComplete="off">
                            <div className="pb-3">
                                <label>Username *</label>
                                <input name="username" className="form-control" placeholder="Username" autoComplete="off" required />
                            </div>
                            <div className="pb-3">
                                <label>Email address *</label>
                                <input name="email" className="form-control" placeholder="Email" autoComplete="off" required />
                            </div>
                            <div className="pb-3">
                                <label>Password *</label>
                                <input type="password" name="password" className="form-control" placeholder="Password" required />
                            </div>
                            <div className="privacy-policy-text">
                                <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
                            </div>
                            <div className="contact-button pb-3">
                                <button type="submit" className="mt-2 btn btn-primary">
                                    Register
                                </button>
                            </div>  
                        </form>                        
                        }
                    </div>
                </div> 
                )}   
            </div>
    </section>
    </>
  )
}

export default Login