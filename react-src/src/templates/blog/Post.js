import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

function Post() {
  const [data, setData] = useState(null);
  let { postSlug } = useParams();

  
  useEffect(() => {
    fetch(`/wordpress/wp-json/wp/v2/posts?slug=${postSlug}`)
    .then((res) => res.json())
    .then((data) => setData(data));
  }, [postSlug]);

  return (
    <section className="default-page">
      {data && (
        <>
        <div className="container">
        { data[0].fimg_url ?
        <img className="img-fluid rounded mb-4 mb-lg-0" src={data[0].fimg_url} alt="" />
        : null }
        <h1 dangerouslySetInnerHTML={{ __html: data[0].title?.rendered }} className="mt-5"/>
        <div dangerouslySetInnerHTML={{ __html: data[0].content?.rendered }} />
        </div>
        </>    
      )} 
    </section>
  )
}

export default Post