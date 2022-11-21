/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";

function Team() {
    
    const [data, setData] = useState(null);
    const [teamData, setTeamdata] = useState(null);
    
    const fetchPagedata=()=>{   
        fetch(`/wordpress/wp-json/wp/v2/pages?slug=team`)
        .then(res=>{
        return(res.json())
        })
        .then((data) => setData(data))
    }
    useEffect(() => {
        fetchPagedata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTeamdata = ()=>{
        fetch("/wordpress/wp-json/wp/v2/team-members?acf_format=standard")
        .then(res=>{
          return(res.json())
          })
          .then((data) => setTeamdata(data))
        }        
    useEffect(() => {
        fetchTeamdata()
    }, []);

  return (
    <>
      <section className="section-team">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-8 col-lg-6">
              <div className="header-section">
              {data && (
                <>
                <h3 className="small-title" dangerouslySetInnerHTML={{ __html: data[0].title.rendered }} />
                <h2 className="title"dangerouslySetInnerHTML={{ __html: data[0].content.rendered }} />
                </>
                )}
            </div>
            </div>
          </div>
          <div className="row">
          {teamData && teamData.map((item, index) => {
            return (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={index}>
              <div className="single-person">
                <div className="person-image">
                  <img src={item.fimg_url} alt={item.title.rendered} />
                  <span className="icon">
                    <i className={item.acf.icon_class}></i>
                  </span>
                </div>
                <div className="person-info text-center">
                  <h3 className="full-name">{item.title.rendered}</h3>
                  <span className="speciality">{item.acf.position}</span>
                </div>
              </div>
            </div>
            )
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default Team;
