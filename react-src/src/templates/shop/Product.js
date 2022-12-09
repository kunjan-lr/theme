import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import Swal from "sweetalert2";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import moment from 'moment';

const api = new WooCommerceRestApi({
  url: process.env.REACT_APP_API_BASE_URL,
  consumerKey: process.env.REACT_APP_API_CONSUMERKEY,
  consumerSecret: process.env.REACT_APP_API_CONSUMERSECRET,
  version: process.env.REACT_APP_API_VERSION
});

function Product() {
  let abutton = ''
  const [product, setProducts] = useState([]);
  const [variations, setVariations] = useState([]);
  const [variation, setVariation] = useState({});
  const [relatedproduct, setRelatedproducts] = useState([]);
  const [productreviews, setProductreviews] = useState([]);
  let { productSlug } = useParams();

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
    api.get(`products/${productSlug}`, {
        //per_page: 2,
    }).then((response) => {      
      if (response.status === 200) {
          setProducts(response.data);
      }
    })
    .catch((error) => {
        console.log(error.response.data);
    }); 
  },[productSlug]);

  useEffect(() => {        
    api.get(`products/${productSlug}/variations`, {
        //per_page: 2,
    }).then((response) => {      
      if (response.status === 200) {
          setVariations(response.data);
      }
    })
    .catch((error) => {
        console.log(error.response.data);
    }); 
  },[productSlug]);
  
  const handleChange = e => {
    const { name, value } = e.target;
    setVariation(prevVal => {
      return {
        ...prevVal,
        [name]: value
      }
    })
  };

  const handleSubmit = (e, product) => {
        e.preventDefault();
        let _id;
        let _price;
        variations.length && variations.every(({attributes, id, price}) => {
          
          let isItemExist = true;
         
          // eslint-disable-next-line no-unused-vars, array-callback-return
          const option = attributes?.map(({name,option},idx) => {
            if(variation[name] === option && isItemExist) {
              isItemExist = true
            } else {
              isItemExist = false
            }
          })
  
          if(isItemExist) {
            _id = id;
            _price = price;
            return false
          }        
          return true
  
        })
        
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
            allProducts = [ ...localcartproducts, {...product, variation_id: _id, quantity: 1, price: _price, variation: variation} ];
          else 
            allProducts.push({...product, variation_id: _id, quantity: 1, price: _price, variation: variation})
            window.localStorage.setItem('cartitems', JSON.stringify(allProducts));
        }  
        Swal.fire({
          icon: 'success',
          title: 'Product added to cart successfully'
        })
    };

  const pimages = product.images && product.images.map((element, index) => {
    return { original: element.src, thumbnail: element.src }
  }) 

  useEffect(() => {    
    const allRelatedproduct = [];
    product.related_ids && product.related_ids.map((element) => {
        api.get(`products/${element}`)
          .then((response) => {
            if (response.status === 200) {
              //setRelatedproducts(pre=>[...pre,response.data])
              allRelatedproduct.push(response.data)
            }   
          });
      });
      setRelatedproducts(allRelatedproduct)
  }, [product.related_ids]);

  console.log(relatedproduct)
  
  const handleSubmitreview = (event) => {
    event.preventDefault();

    const { target } = event;
    let reviewinfo = Object.fromEntries(new FormData(target))

    const data = {
      product_id: reviewinfo.product_id,
      review: reviewinfo.review,
      reviewer: reviewinfo.reviewer,
      reviewer_email: reviewinfo.reviewer_email,
      rating: reviewinfo.rating,
    };

    api.post("products/reviews", data)
    .then((response) => {
      //console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Review added successfully!'
      })
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  }

  useEffect(() => {
    api.get(`products/reviews?product=${productSlug}`)
    .then((response) => {
      setProductreviews(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
  },[productSlug])

  return (
    <>
    {product && (
    <>
    <section className="default-page">
      <div className="container">
        <div className="row">
            <div className="col-lg-7">
              {pimages && <ImageGallery items={pimages} />}
            </div>
            <div className="col-lg-5">
              <h1 className="font-weight-light">{product.name}</h1>
              <h6 className="text-success text-uppercase">{product.stock_status}</h6>
              <div className='newprice' dangerouslySetInnerHTML={{ __html: product.price_html }} />
              <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
              {product.type === 'variable'?
              <form onSubmit={(e) => { handleSubmit(e, product); }}>
              {product.attributes && product.attributes.map((element, index) => {
                return(
                  <>
                  <label key={index}>{element.name}</label>
                  <select className="form-control" value={variation[element.name]} name={element.name} onChange={handleChange} >
                    <option>Choose an option</option>
                    {element.options.map(item => {
                        return (<option key={item} value={item}>{item}</option>);
                    })}
                  </select>
                  </>
                  )
              })}
              <button className='mt-2 btn btn-primary' type='submit'>Add to cart</button>
              </form>
              : <button className='mt-2 btn btn-primary' onClick={(e) => { addToCart(e, product); }}>Add to cart</button> }
              <h6 className="text-warning text-uppercase pt-3">Sku: <span className="text-primary">{product.sku}</span></h6>
              <h6 className="text-warning text-uppercase">Categories:  
              {product.categories && product.categories.map((element, index) => {
                return(
                  <span className="text-primary" key={index}> {" "}{element.name} {index === product.categories.length - 1 ? "" : ","}</span>
                )
              })}
              </h6>
            </div>
          </div>
          <div className="pt-5">
          <Tabs defaultActiveKey="description" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="description" title="Description">
              <h6 className='pt-4 pl-2'>Description</h6>
              <div className='pl-2' dangerouslySetInnerHTML={{ __html: product.description }} />
            </Tab>
            <Tab eventKey="additional-information" title="Additional information">
              <h6 className='pt-4 pl-2'>Additional information</h6>
              <table className="table table-bordered">
                <tbody>
                {product.attributes && product.attributes.map((element, index) => {
                  return(
                    <tr>
                    <td>{element.name}</td>
                    <td>{element.options.join(', ')}</td>
                    </tr>
                    )
                })}
                </tbody>
              </table>
            </Tab>
            <Tab eventKey="reviews" title="Reviews">
              <div className="row">
                <div className="col-lg-6">
                { productreviews &&
                <h2 className="woocommerce-Reviews-title">{productreviews?.length} {productreviews?.length > 1 ? 'reviews' : 'review'} for <span>{product.name}</span></h2>
                }
                { productreviews && productreviews.map((review, index) => {
                  let width = '';
                  if(review.rating === 1){
                    width = '5%';
                  }
                  if(review.rating === 2){
                    width = '10%';
                  }
                  if(review.rating === 3){
                    width = '15%';
                  }
                  if(review.rating === 4){
                    width = '20%';
                  }
                  if(review.rating === 5){
                    width = '25%';
                  }
                  return (
                  <div key={index}>
                    <div class="star">
                      <div class="rating" style={{ width: width }}>
                          <span>&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span>
                      </div>
                    </div>
                    <strong>{review.reviewer}</strong> - {moment(review.date_created).format("MMM D, Y")}
                    <div dangerouslySetInnerHTML={{ __html:review.review }} />
                  </div>
                  )
                })}
                </div>
                <div className="col-lg-6">
                  <form onSubmit={handleSubmitreview}>
                    <input type="hidden" id="product_id" name="product_id" value={productSlug} />
                    <div className="comment-form-rating pb-3">
                      <label>
                        <div>Your rating*</div>
                        <div className="rate pb-5">
                          <input type="radio" id="star5" name="rating" value="5" />
                          <label htmlFor="star5" title="5 stars">5 stars</label>
                          <input type="radio" id="star4" name="rating" value="4" />
                          <label htmlFor="star4" title="4 stars">4 stars</label>
                          <input type="radio" id="star3" name="rating" value="3" />
                          <label htmlFor="star3" title="3 stars">3 stars</label>
                          <input type="radio" id="star2" name="rating" value="2" />
                          <label htmlFor="star2" title="2 stars">2 stars</label>
                          <input type="radio" id="star1" name="rating" value="1" />
                          <label htmlFor="star1" title="1 star">1 star</label>
                        </div>
                      </label>
                    </div>
                    <div className="pb-3">
                      <label>Your review *</label>
                      <textarea id="review" name="review" className="form-control" required />
                    </div>
                    <div className="pb-3">
                      <label>Name*</label>
                      <input id="reviewer" name="reviewer" className="form-control" type="text" required />
                    </div>
                    <div className="pb-3">
                      <label>Email*</label>
                      <input id="reviewer_email" name="reviewer_email" className="form-control" type="email" required />
                    </div>              
                    <div className="pb-5">
                      <input type="submit" value="Submit" className="mt-2 btn btn-primary" />
                    </div>
                  </form>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </section>
    <section className="section-products">
        <div className="container">
              <h4>Related Products</h4>
              <div className="row">
                
              {relatedproduct && relatedproduct.map((product, index) => {
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
                              <h4 className="product-price"><div dangerouslySetInnerHTML={{ __html: product.price_html }} /></h4>
                          </div>
                      </div>
                  </div>
                  );
              })}            
              </div>
        </div>
    </section>
    </>
    )}
    </>
  )
}

export default Product