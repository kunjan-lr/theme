import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Swal from "sweetalert2";

const api = new WooCommerceRestApi({
    url: process.env.REACT_APP_API_BASE_URL,
    consumerKey: process.env.REACT_APP_API_CONSUMERKEY,
    consumerSecret: process.env.REACT_APP_API_CONSUMERSECRET,
    version: process.env.REACT_APP_API_VERSION
});

function Products() {
    let abutton = ''
    const [products, setProducts] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setpage] = useState(1);
    
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
        }else{
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
    
    useEffect(() => {        
        api.get("products", {
            per_page: 8,
            page: `${page}`,
        })
        .then((response) => {           
          if (response.status === 200) {
              setPageCount(response.headers["x-wp-totalpages"]);
              setProducts(response.data);
          }                   
        })
        .catch((error) => {
            console.log(error.response.data);
        }); 
    },[page]);

  return (
    <>
    <section className="section-products">
    <div className="container">
    <div className="row">
    {products.map((product, index) => {
        if(product.type === 'simple'){
            abutton = <button onClick={(e) => { addToCart(e, product); }} style={{ border : '0' }} ><i className="fas fa-shopping-cart"></i></button>
         }else{
            abutton = <Link to={ `/wordpress/product/${product.id}` } ><i className="fas fa-shopping-cart"></i></Link>
         }
        return (                
            <div className="col-md-6 col-lg-4 col-xl-3" key={index}>
            <div id="product-1" className="single-product">
                <div className="part-1">
                    <span className="onsale" data-shape="type-2">{product.sale_price ? 'SALE!' : ''}</span>
                    <img src={product?.images?.[0]["src"]} alt={product.name} width={290} height={290} />
                    <ul>
                    <li>
                        {abutton}
                    </li>                    
                    </ul>
                </div>
                <div className="part-2">
                <Link to={ `/wordpress/product/${product.id}` } className="text-decoration-none"><h3 className="product-title">{product.name}</h3></Link>
                    {/* <h4 className="product-old-price">$79.99</h4> */}
                    <h4 className="product-price"><div dangerouslySetInnerHTML={{ __html: product.price_html }} /></h4>
                </div>
            </div>
        </div>
        );
    })}            
    </div>    
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
    </div>
    </section>
    </>
  )
}

export default Products