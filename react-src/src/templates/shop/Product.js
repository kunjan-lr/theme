import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { useParams } from "react-router";
//import { Link } from 'react-router-dom';
//import Carousel from 'react-bootstrap/Carousel';
import ImageGallery from 'react-image-gallery';
import Swal from "sweetalert2";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const api = new WooCommerceRestApi({
  url: process.env.REACT_APP_API_BASE_URL,
  consumerKey: process.env.REACT_APP_API_CONSUMERKEY,
  consumerSecret: process.env.REACT_APP_API_CONSUMERSECRET,
  version: process.env.REACT_APP_API_VERSION
});

function Product() {
  const [product, setProducts] = useState([]);
  const [variations, setVariations] = useState([]);
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

  const [variation, setVariation] = useState({});
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
            //console.log(option, '===option')
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
        // console.log(_id,'id===')
        // console.log(_price,'price===')
        
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

  return (
    <>
    {product && (
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
            <Tab eventKey="reviews" title="Reviews" >
            <h6 className='pt-4 pl-2'>Reviews</h6>
            </Tab>
          </Tabs>
        </div>
      </div>
    </section>
    )}
    </>
  )
}

export default Product