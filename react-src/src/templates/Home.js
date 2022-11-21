import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import Swal from "sweetalert2";

const api = new WooCommerceRestApi({
    url: process.env.REACT_APP_API_BASE_URL,
    consumerKey: process.env.REACT_APP_API_CONSUMERKEY,
    consumerSecret: process.env.REACT_APP_API_CONSUMERSECRET,
    version: process.env.REACT_APP_API_VERSION
});

function Home() {
    let abutton = ''
    const [data, setData] = useState(null);
    const [products, setProducts] = useState([]);
 
    const addToCart = (event, product) => {  
      
        const localcartproducts = JSON.parse(window.localStorage.getItem("cartitems"));
        const found = localcartproducts?.some(el => el.id === product.id);

        if(found){
        let productinfo = localcartproducts.map((item)=> { if(product.id === item.id){
            return { ...item, quantity: item.quantity + 1}
        }else{
            return item;
        }})        
            window.localStorage.setItem('cartitems', JSON.stringify(productinfo));
        }
        else
        {
            let allProducts = [];
            if(localcartproducts?.length) 
                allProducts = [ ...localcartproducts, {...product, quantity: 1} ];
            else 
                allProducts.push({...product, quantity: 1})        
                window.localStorage.setItem('cartitems', JSON.stringify(allProducts));
        }
        
        Swal.fire({
            icon: 'success',
            title: 'Product added to cart successfully'
        })
    }

    const fetchHomedata=()=>{   
        fetch("wp-json/wp/v2/pages/5?acf_format=standard")
        .then(res=>{
        return(res.json())
        })
        .then((data) => setData(data))
    }
    useEffect(() => {
        fetchHomedata()
    }, []);

    useEffect(() => {        
        api.get("products")
        .then((response) => {           
          if (response.status === 200) {
              setProducts(response.data);
          }                   
        })
        .catch((error) => {
            console.log(error.response.data);
        }); 
    },[]);

    //console.log(products)
  return (
    <>
    <Carousel>
    {data && data?.acf.sliders.map((item, index) => {
        return (
            <Carousel.Item interval={2000} key={index}>
                <img src={item.slide_image.sizes.large} className="d-block w-100" alt="slider" />
                <Carousel.Caption>
                <h3>{item.title_text}</h3>
                <p>{item.content}</p>
                </Carousel.Caption>
            </Carousel.Item>
        )
    })}        
    </Carousel>
    <section className="section-products">
        <div className="container">
            <div className="row justify-content-center text-center">
            <div className="col-md-8 col-lg-6">
                <div className="header">
                <h3>Featured Product</h3>
                <h2>Popular Products</h2>
                </div>
            </div>
            </div>
            <div className="row">
            { 
            // eslint-disable-next-line array-callback-return
            products && products.map((product) => {
              
              if(product.type === 'simple'){
                 abutton = <button onClick={(e) => { addToCart(e, product); }} style={{ border : '0' }} ><i className="fas fa-shopping-cart"></i></button>
              }else{
                 abutton = <Link to={ `/product/${product.id}` } ><i className="fas fa-shopping-cart"></i></Link>
              }
              
              if(product?.featured === true){
                return (                
                <div className="col-md-6 col-lg-4 col-xl-3" key={product.id}>
                    <div id="product-1" className="single-product">
                        <div className="part-1">
                            <span className="onsale" data-shape="type-2">{product.sale_price ? 'SALE!' : ''}</span>
                            <img src={product?.images?.[0]["src"]} alt={product.name} width={290} height={290} />
                            <ul>
                                <li>{abutton}</li>                            
                            </ul>
                        </div>
                        <div className="part-2">
                            <Link to={ `/wordpress/product/${product.id}` } className="text-decoration-none"><h3 className="product-title">{product.name}</h3></Link>
                            <h4 className="product-price"><div dangerouslySetInnerHTML={{ __html: product.price_html }} /></h4>
                        </div>
                    </div>
                </div>
                )
              }
            })}
            </div>
        </div>
        </section>
    </>
  )
}

export default Home