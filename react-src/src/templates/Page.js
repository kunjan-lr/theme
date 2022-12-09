import React, { useEffect, useState } from 'react'
import { useParams } from "react-router";
import Accordion from 'react-bootstrap/Accordion';
import Iframe from 'react-iframe'

function Page() {
    const [data, setData] = useState(null);
    const [faqData, setDatafaq] = useState(null);
    const [sucessMessage, setSuccessmessage] = useState('');

    let { slug } = useParams();

    const fetchPagedata=()=>{   
        fetch(`/wordpress/wp-json/wp/v2/pages?slug=${slug}`)
        .then(res=>{
        return(res.json())
        })
        .then((data) => setData(data))
    }
    useEffect(() => {
        fetchPagedata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);
    
    const fetchFaqs = ()=>{
        fetch("/wordpress/wp-json/wp/v2/faq")
        .then(res=>{
          return(res.json())
          })
          .then((data) => setDatafaq(data))
        }        
    useEffect(() => {
        fetchFaqs()
    }, []);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-unused-vars
        const { target } = e;
        let info = Object.fromEntries(new FormData(target))

        var formdata = new FormData();
        
        formdata.append("yourname", info.yourname);
        formdata.append("youremail", info.youremail);
        formdata.append("yoursubject", info.yoursubject);
        formdata.append("yourmessage", info.yourmessage);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("/wordpress/wp-json/contact-form-7/v1/contact-forms/134/feedback", requestOptions)
        .then(response => response.text())
        .then(result => setSuccessmessage(JSON.parse(result)))
        .catch(error => console.log('error', error));
    }

    return (
        <>
        <section className="default-page mb-5">
            <div className="container">
                {data && (
                    <>
                    <div className="row">
                        <div className="col-lg-6">
                            { data[0].fimg_url ?
                            <img src={data[0].fimg_url} alt={data[0].title.rendered} width={500} />
                            : null }
                        </div>
                        <div className={`col-lg-${ data[0].fimg_url ? 6 : 12 }`}>
                            <h1 dangerouslySetInnerHTML={{ __html: data[0].title.rendered }} />
                            <div dangerouslySetInnerHTML={{ __html: data[0].content.rendered }} />
                        </div>
                    </div>
                    </>
                )} 
                <Accordion defaultActiveKey="0" flush>    
                    { slug === 'faqs' ? 
                    faqData && faqData.map((item, index) => {
                        return (
                            <Accordion.Item eventKey={index} key={index}>
                                <Accordion.Header><div dangerouslySetInnerHTML={{ __html: item.title.rendered }} /></Accordion.Header>
                                <Accordion.Body>
                                    <div dangerouslySetInnerHTML={{ __html: item.content.rendered }} />
                                </Accordion.Body>
                            </Accordion.Item>         
                        )
                    })
                    : null }
                </Accordion>
                { slug === 'contact-us' ?
                    <>
                    <div className="row">
                        <div className="col-lg-6">
                            <form method='post' onSubmit={handleOnSubmit} >
                                <div className="pb-3">
                                    <label>Your Name</label>
                                    <input name="yourname" className="form-control" placeholder="Your Name" required />
                                </div>
                                <div className="pb-3">
                                    <label>Your Email</label>
                                    <input name="youremail" className="form-control" placeholder="Your Email" required />
                                </div>
                                <div className="pb-3">
                                    <label>Your Subject</label>
                                    <input name="yoursubject" className="form-control" placeholder="Your Subject" required />
                                </div>
                                <div className="pb-3">
                                    <label>Your Message</label>
                                    <textarea name="yourmessage" className="form-control" placeholder="Your Message" />
                                </div>
                                <div className="contact-button pb-3">
                                <button type="submit" className="mt-2 btn btn-primary">
                                    Submit
                                </button>
                                </div>                                         
                            </form>
                            <p className='text-success mt-2'>{sucessMessage?.message}</p>
                        </div> 
                        <div className="col-lg-6">
                            <Iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29375.188263200922!2d72.4904064!3d23.0274975!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b28564ae2f3%3A0xb9e7fb6f6c53b5cf!2sLogicRays%20Technologies%20-%20eCommerce%20%26%20Web%20Development%20%7C%20Mobile%20App%20Development%20Services%20in%20USA!5e0!3m2!1sen!2sin!4v1668689912661!5m2!1sen!2sin" height="400" width="100%" />
                        </div>
                    </div>                          
                    </>
                : null }
            </div>     
        </section>    
        </>
    )
}

export default Page