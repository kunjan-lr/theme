/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import NumericInput from 'react-numeric-input';
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import Swal from "sweetalert2";

const api = new WooCommerceRestApi({
  url: process.env.REACT_APP_API_BASE_URL,
  consumerKey: process.env.REACT_APP_API_CONSUMERKEY,
  consumerSecret: process.env.REACT_APP_API_CONSUMERSECRET,
  version: process.env.REACT_APP_API_VERSION
});

function Cart() {
    let total = 0;

    const cartproducts = JSON.parse(window.localStorage.getItem("cartitems"));
    const [updatecart, setUpdatecart] = useState();
    const [couponamount, setCouponamount] = useState();
    
    const handleOnSubmit = (e) => {
      e.preventDefault();
      const { target } = e;

      const couponCode = Object.fromEntries(new FormData(target))
      
      api.get(`coupons?code=${couponCode.coupon_code}`)
      .then((response) => {
        setCouponamount(response.data[0].amount)      
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Ooops, something went wrong",
        });
      });
      
    }
    console.log(couponamount);
    const removeProduct = (event, productid) => {
      setUpdatecart((current) =>
        current.filter((updatecart) => {
          return updatecart.id !== productid;
        })
      );
    };
  
    useEffect(() => {
      cartproducts && setUpdatecart(cartproducts)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    useEffect(() => {
      updatecart && window.localStorage.setItem("cartitems", JSON.stringify(updatecart));
      window.localStorage.setItem('cartitemstotal', total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatecart])
   
    const getSum = (quantity, price) => {
      const sum = price * quantity;
      total += sum;
      return sum.toFixed(2);
    };
  
    const onChangeHandler = (valuer, productid) => {
  
      const localcartproducts = JSON.parse(window.localStorage.getItem("cartitems"));
      const found = localcartproducts?.some(el => el.id === productid);
  
      if(found){
        let productinfo = localcartproducts.map((item)=> { if(productid === item.id){        
          return { ...item, quantity: valuer}
        }else{
          return item;
        }})
        setUpdatecart(productinfo)
        window.localStorage.setItem('cartitems', JSON.stringify(productinfo));
      }
  
    };

  return (
    <>
    <section className="default-page mb-5">
    <div className="container">
          <div className="align-items-center my-5">
            <h1 className="font-weight-light">Cart</h1>
          </div>
          <Table bordered hover>
            <thead>
              <tr>
                <th className="text-center py-3 px-4">
                  Product Name &amp; Details
                </th>
                <th className="text-center py-3 px-4">Price</th>
                <th className="text-center py-3 px-4">Quantity</th>
                <th className="text-center py-3 px-4">Total</th>
                <th className="text-center py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {updatecart &&
                updatecart.map((product) => {
                  return (
                    <tr className="cartinformation" key={product.id}>
                      <td>
                        <div className="media align-items-center">
                          <img
                            src={product.images[0]["src"]}
                            alt={product.name}
                            className="d-block ui-w-40 ui-bordered mr-4"
                            width={80}
                            height={80}
                          />
                          {product.type === 'variable' ? 
                          <div className="media-body">{product.name} - {product.variation && Object.keys(product.variation).map(function(k){return product.variation[k]}).join(",")}</div>                                                    
                          : <div className="media-body">{product.name}</div>}
                          </div>
                      </td>
                      <td className="text-center font-weight-semibold align-middle">                        
                        <span className="woocommerce-Price-currencySymbol">$</span>
                        {Number(product.price).toFixed(2)}
                      </td>
                      <td className="align-middle text-center">
                        <NumericInput min={1} value={product.quantity} onChange={(e) => {
                            onChangeHandler(e, product.id);
                          }} className="form-control text-center" />
                      </td>
                      <td className="text-center font-weight-semibold align-middle">
                        <span className="woocommerce-Price-currencySymbol">$</span>
                        {getSum(product.quantity, product.price)}
                      </td>
                      <td className="text-center align-middle px-0">
                        <a href="" onClick={(e) => { removeProduct(e, product.id); }}
                          className="shop-tooltip close float-none text-danger text-decoration-none">×</a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="mt-2">
              <form className="d-flex" onSubmit={handleOnSubmit}>
                <input type="text" name="coupon_code" placeholder="Coupon code"/>
                <button type="submit" className="btn btn-primary mx-2">Apply coupon</button>
              </form>
            </div>
            <div className="d-flex">
              <div className="text-right">
                <label className="text-muted font-weight-normal m-0">
                  Total price
                </label>
                <div className="text-large">
                  <strong>
                    <span className="woocommerce-Price-currencySymbol">
                      ${total.toFixed(2)}
                    </span>
                  </strong>
                </div>                
                <Link to={ '/wordpress/checkout/' } className="mt-2 btn btn-primary">Proceed to checkout</Link>                
              </div>
            </div>
          </div>
        </div>
    </section>
    </>
  )
}

export default Cart