import React, { useEffect, useState } from 'react'

function Customform() {
    const [token, setToken] = useState();

    useEffect(() => {
        const requestData = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "admin", password: "admin123" }),
        };
  
        fetch("/wordpress/wp-json/jwt-auth/v1/token",
            requestData
        )
        .then((response) => response.json())
        .then((data) => setToken(data.token))
        .catch(e=>console.log(e));
    }, []);    
    
    const handleOnSubmit = (e) => {
        e.preventDefault();

        const { target } = e;
        let info = Object.fromEntries(new FormData(target))
        
        var information = JSON.stringify({
            "title": info.yourname,
            "status": "publish",
            "acf": {
                "name": info.yourname,
                "email": info.youremail,
                "subject": info.yoursubject,
                "message": info.yourmessage
            }
        });
        
        if(token){
            fetch('/wordpress/wp-json/wp/v2/customform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: information,
            })
            .then((response) => response.json())
            //Then with the data from the response in JSON...
            .then((data) => {
                console.log('Success:', data);
            })
            //Then with the error genereted...
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }
  return (
    <>
    <section className="default-page mb-5">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
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
                            <button type="submit" className="mt-2 btn btn-primary">Submit</button>
                        </div>                                         
                    </form>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default Customform