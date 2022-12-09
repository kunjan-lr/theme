import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Single from "./templates/Single";
import Home from "./templates/Home";
import Shop from "./templates/shop/Shop";
import Products from "./templates/shop/Products";
import Product from "./templates/shop/Product";
import Head from "./partials/Head";
import Foot from "./partials/Foot";
import Page from "./templates/Page";
import Blog from "./templates/blog/Blog";
import Posts from "./templates/blog/Posts";
import Post from "./templates/blog/Post";
import Cart from "./templates/Cart";
import Checkout from "./templates/Checkout";
import Team from "./templates/Team";
import Login from "./templates/Login";
import Parent from "./templates/Parent";
import Customform from "./templates/Customform";

function App() {
    return (
        <div className="App">
            <Router>
                <Head />
                <Routes>
                    <Route path='wordpress/parent' element={<Parent />}/>
                    <Route path='wordpress/' element={<Home />}/>
                    <Route path='wordpress/team' element={<Team />}/>
                    <Route path='wordpress/cart' element={<Cart />}/>
                    <Route path='wordpress/checkout' element={<Checkout />}/>
                    <Route path='wordpress/:slug' exact element={<Page />}/>
                    {/* <Route path='wordpress/blog/' element={<Single />}/> */}
                    <Route path="wordpress/" element={<Shop />} >
                        <Route path="shop" element={<Products />} />
                        <Route path="product/:productSlug" element={<Product />} />
                    </Route>
                    <Route path="wordpress/blog" element={<Blog />}>
                        <Route path="" element={<Posts />} />
                        <Route path=":postSlug" exact element={<Post />} />
                    </Route>
                    <Route path="wordpress/my-account" element={<Login />}></Route>               
                    <Route path="wordpress/custom-form" element={<Customform />}></Route>               
                </Routes>
                <Foot />
            </Router>
        </div>
    );
}

export default App;
