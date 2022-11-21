import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';

function Posts() {
  const [data, setData] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setpage] = useState(1);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPosts=()=>{
    fetch(`/wordpress/wp-json/wp/v2/posts?per_page=3&page=${page}`)
    .then(res=>{
      setPageCount(res.headers.get('X-WP-TotalPages'))
      return(
        res.json()
        )
      })
      .then((data) => setData(data))
    }
    
  useEffect(() => {
    fetchPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
    <section className="default-page">
      <div className="container">
      {data && data.map((item,index) => {
        return (        
          <div className="row align-items-center mb-5" key={index}>
            <div className="col-lg-4">
              { item.fimg_url ?  
              <img className="img-fluid rounded mb-4 mb-lg-0" src={item.fimg_url} alt={item.slug} />
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              : <img className="img-fluid rounded mb-4 mb-lg-0" src="https://via.placeholder.com/356x143.png?text=Blog Image" alt="Blog image" /> }
            </div>
            <div className="col-lg-8">
            <Link to={ `/wordpress/blog/${item.slug}` } key={item.id} className="text-decoration-none"><h1 className="font-weight-light"><div dangerouslySetInnerHTML={{ __html: item.title.rendered }} /></h1></Link>
              <div dangerouslySetInnerHTML={{ __html: item.excerpt.rendered }} />
            </div>
          </div>        
        );
        })}
      
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

export default Posts