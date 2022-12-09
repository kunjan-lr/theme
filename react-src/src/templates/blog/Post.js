import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";

function Post() {
  const [data, setData] = useState(null);
  const [postcomments, setPostcomments] = useState([]);
  let { postSlug } = useParams();
  
  useEffect(() => {
    fetch(`/wordpress/wp-json/wp/v2/posts?slug=${postSlug}`)
    .then((res) => res.json())
    .then((data) => setData(data));
  }, [postSlug]);

  // eslint-disable-next-line no-unused-vars
  const handleSubmit = (evt) => {
    evt.preventDefault();
  
    const [postId, name, email, comment] = evt.target.elements;
  
    const data = JSON.stringify({
      post: postId.value,
      author_name: name.value,
      author_email: email.value,
      content: comment.value,
    });
    
    fetch("/wordpress/wp-json/wp/v2/comments", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
    .then((response) => {
      
      if (response.ok === true) {
        // Submitted successfully!
        Swal.fire({
          icon: 'success',
          title: 'Submitted successfully!'
        })
      }

      if (response.ok === false) {
        Swal.fire({
          icon: 'error',
          title: 'Comment submission failed.'
        })
      }
      return response.json();
    })
  }

  useEffect(() => {
    if(data){
      fetch(`/wordpress/wp-json/wp/v2/comments?post=${data[0].id}`)
      .then((res) => res.json())
      .then((data) => setPostcomments(data))
    }
  },[data])

  return (
    <>
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
    <section className="comment-form">
      <div className="container">
          <div className="row">
            <div className="col-lg-6">
              {data && (
                <h2>{postcomments?.length} {postcomments?.length > 1 ? 'replies' : 'reply'} on "{data[0].title?.rendered}"</h2>
              )}
              {postcomments && postcomments.map((comment, index) => {
                return(
                  <div className="comment" key={index}>
                    <div className="comment-author vcard">
                      <img src={comment.author_avatar_urls[48]} alt={comment.author_name} />
                      <h4 className="mt-2">{comment.author_name}</h4>
                      {moment(comment.date).format("MMMM D, Y, h:mm a")}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: comment.content?.rendered }} />
                  </div>
                )
              })}
            </div>
            <div className="col-lg-6">
              <h4>Post a comment</h4>
              <form onSubmit={handleSubmit}>
                {data && 
                <input type="hidden" id="postId" value={data[0].id} />
                }
                <div className="pb-3">
                  <label>Name*</label>
                  <input id="name" className="form-control" type="text" required />
                </div>
                <div className="pb-3">
                  <label>Email*</label>
                  <input id="email" className="form-control" type="email" required />
                </div>
                <div className="pb-3">
                  <label>Comment*</label>
                  <textarea id="comment" className="form-control" required />
                </div>
                <div className="pb-5">
                  <input type="submit" value="Post comment!" className="mt-2 btn btn-primary" />
                </div>
                </form>
            </div>
          </div>
        </div>
      </section>
      </>
  )
}

export default Post