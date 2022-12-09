import React from 'react';

class Parent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: null
        }
    }

    handleCallback = (childData) =>{
        this.setState({data: childData})
    }

    render(){
        const {data} = this.state;
        return(
            <div className="container">
                <Child parentCallback = {this.handleCallback}/>
                {data}
            </div>
        )
    }
}

class Child extends React.Component{
  
    onTrigger = (event) => {
        this.props.parentCallback(event.target.myname.value);
        event.preventDefault();
    }

    render(){
        return(
        <section className="section-products">
            <div className="container">
                <form onSubmit = {this.onTrigger}>
                    <input type="text" name='myname' />
                    <input type = "submit" value = "Submit"/>
                </form>
            </div>
        </section>
        )
    }
}

export default Parent;