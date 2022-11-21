import React, { useEffect, useState } from "react";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {
  Form,
  Radio,
  Button,
} from "semantic-ui-react";
import Swal from "sweetalert2";

const api = new WooCommerceRestApi({
    url: process.env.REACT_APP_API_BASE_URL,
    consumerKey: process.env.REACT_APP_API_CONSUMERKEY,
    consumerSecret: process.env.REACT_APP_API_CONSUMERSECRET,
    version: process.env.REACT_APP_API_VERSION
});

function Checkout() {
    let total = 0;

    const [countries, setCountries] = useState();
    const [states, setStates] = useState([]);
    const [paymentgateways, setPaymentgateways] = useState();
    const [state, setState] = useState();
    const [selectedcountry, setSelectedCountry] = useState("");
    const cartproducts = JSON.parse(window.localStorage.getItem("cartitems"));
    // eslint-disable-next-line no-unused-vars
    const [logininfo, setLogininfo] = useState(JSON.parse(localStorage.getItem("customerinfo")));

    const handleChange = (e, value) => {
      setState(value);
    };
  
    useEffect(() => {
      api
        .get("data/countries", {
          //per_page: 2,
        })
        .then((response) => {
          if (response.status === 200) {
            setCountries(response.data);
          }
        })
        .catch((error) => {
          console.log(error?.response?.data, "error with contries");
        });
    }, []);
  
    const handleSelectChange = (event) => {
      setSelectedCountry(event.target.value);
    };
  
    useEffect(() => {
      if (selectedcountry) {
        api
          .get(`data/countries/${selectedcountry}`, {
            //per_page: 2,
          })
          .then((response) => {
            if (response?.data?.states?.length) setStates(response?.data?.states);
            else setStates([]);
          })
          .catch((error) => {
            console.log(error?.response?.data, "Error with states:");
          });
      }
    }, [selectedcountry]);
  
    useEffect(() => {
      api.get("payment_gateways")
        .then((response) => {
          const gatways = [];
          // eslint-disable-next-line array-callback-return
          response.data && response.data.map((e) => {
            if(e.enabled === true){
              gatways.push(e)
            }
          })
          setPaymentgateways(gatways)
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }, []);
  
    const handleOnSubmit = (e) => {
      e.preventDefault();
      const { target } = e;
  
      var datafiltered = cartproducts.map(function (el) {
        return {
          product_id: el.id,
          variation_id: el.variation_id,
          quantity: el.quantity,
        };
      });
      // eslint-disable-next-line no-unused-vars
      const cartitemstotal = JSON.parse(
        window.localStorage.getItem("cartitemstotal")
      );
      
      let orderinfo = Object.fromEntries(new FormData(target))
  
      const orderInfo = {
        payment_method: orderinfo.payment_method,
        payment_method_title: orderinfo.payment_method_title,
        set_paid: true,
        customer_id: logininfo ? logininfo['data'].ID : null,
        billing: {
          first_name: orderinfo.first_name,
          last_name: orderinfo.last_name,
          address_1: orderinfo.address_1,
          address_2: orderinfo.address_2,
          city: orderinfo.city,
          state: orderinfo.state,
          postcode: orderinfo.postcode,
          country: orderinfo.state,
          email: orderinfo.email,
          phone: orderinfo.phone,
        },
        shipping: {
          first_name: orderinfo.first_name,
          last_name: orderinfo.last_name,
          address_1: orderinfo.address_1,
          address_2: orderinfo.address_2,
          city: orderinfo.city,
          state: orderinfo.state,
          postcode: orderinfo.postcode,
          country: orderinfo.state,
          email: orderinfo.email,
          phone: orderinfo.phone,
        },
        line_items: datafiltered,
        shipping_lines: [
          {
            method_id: "free_shipping",
            method_title: "Free shipping",
            total: "",
          },
        ],
      };
      //console.log(Object.fromEntries(new FormData(target)))
      api.post("orders", orderInfo)
        .then((data) => {
          Swal.fire({
            icon: "success",
            title: "Place order Successfully",
          });

          localStorage.removeItem('cartitems');
          localStorage.removeItem('cartitemstotal');
          
          window.location.href = "/wordpress/shop";
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Ooops, something went wrong",
          });
        });  
    };
  
    const getSum = (quantity, price) => {
      const sum = price * quantity;
      total += sum;
      return sum.toFixed(2);
    };

  return (
    <>
    <section className="default-page mb-5">
    <div className="container">
          <div className="align-items-center my-5">
            <h1 className="font-weight-light">Checkout</h1>
          </div>
          <div className="row checkout">
            <div className="col-lg-7">
              <Form onSubmit={handleOnSubmit}>
                <Form.Field>
                  <label>First Name</label>
                  <input name="first_name" className="form-control" placeholder="First Name" required />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <input name="last_name" className="form-control" placeholder="Last Name" required />
                </Form.Field>
                <Form.Field>
                  <label>Address 1</label>
                  <input name="address_1" className="form-control" placeholder="Address" required />
                </Form.Field>
                <Form.Field>
                  <label>Address 2</label>
                  <input name="address_2" className="form-control" placeholder="Address" required />
                </Form.Field>
                <Form.Field>
                  <label>City</label>
                  <input name="city" className="form-control" placeholder="city" required />
                </Form.Field>
                <Form.Field label="Country" name="country" className="custom-select-box" control="select" value={selectedcountry} onChange={handleSelectChange} >
                  <option value="">-Select country-</option>
                  {countries &&
                    countries.map((element, index) => {
                      return (
                        <option value={element.code}>{element.name}</option>
                      );
                    })}
                </Form.Field>
                {states.length > 0 ? (
                  <Form.Field label="State" name="state" className="custom-select-box" control="select">
                    <option value="">-Select state-</option>
                    {states.length > 0 &&
                      states?.map((state) => {
                        return <option value={state.code}>{state.name}</option>;
                      })}
                  </Form.Field>
                ) : (
                  ""
                )}
                <Form.Field>
                  <label>Postcode</label>
                  <input name="postcode" className="form-control" placeholder="Postcode" required />
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <input name="email" className="form-control" placeholder="Email" required />
                </Form.Field>
                <Form.Field>
                  <label>Phone</label>
                  <input name="phone" className="form-control" placeholder="Phone" required />
                </Form.Field>
                <div className="wc-payment">
                <Form.Field className="payment">                      
                {paymentgateways &&
                  paymentgateways.map((element) => {
                    return (
                        <>
                        <Radio
                          label={<div dangerouslySetInnerHTML={{ __html: element.title }} />}
                          name="payment_method"
                          value={element.id}
                          checked={state?.value === element.id}
                          onChange={handleChange}
                        />
                        <input type="hidden" name="payment_method_title" value={element.title}/>
                        </>
                    );
                  })}
                </Form.Field>
                </div>
                <div className="ck-button">
                  <Button type="submit" className="mt-2 btn btn-primary">
                    Continue to checkout
                  </Button>
                </div>
              </Form>
            </div>
            <div className="col-lg-5">
              <table className="table table-bordered m-0 mb-2">
                <thead>
                  <tr>
                    <th className="text-center py-3 px-4">
                      Product Name &amp; Details
                    </th>
                    <th className="text-center py-3 px-4">Quantity</th>
                    <th className="text-center py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartproducts &&
                    cartproducts.map((product) => {
                      return (
                        <tr className="cartinformation" key={product.id}>
                          <td className="p-4">
                            <div className="media align-items-center">
                              <img
                                src={product.images[0]["src"]}
                                alt={product.name}
                                className="d-block ui-w-40 ui-bordered mr-4"
                                width={80}
                                height={80}
                              />
                              {product.type === "variable" ? (
                                <div className="media-body">
                                  {product.name} -{" "}
                                  {product.variation &&
                                    Object.keys(product.variation)
                                      .map(function (k) {
                                        return product.variation[k];
                                      }).join(",")}
                                </div>
                              ) : (
                                <div className="media-body">{product.name}</div>
                              )}
                            </div>
                          </td>
                          <td className="align-middle p-4 text-center">
                            {product.quantity} x{" "}
                            {Number(product.price).toFixed(2)}
                          </td>
                          <td className="text-center font-weight-semibold align-middle p-4">
                            <span className="woocommerce-Price-currencySymbol">
                              $
                            </span>
                            {getSum(product.quantity, product.price)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="text-right">
                <p className="text-muted font-weight-normal m-0">
                  Total price: ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
    </section>
    </>
  )
}

export default Checkout