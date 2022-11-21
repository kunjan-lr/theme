import React from "react";
const storeContext = React.createContext();
export const Consumer = storeContext.Consumer;
export class Provider extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
      posts : []
    };
  }
 componentDidMount(){
    this.setState({
       posts : ['title','title2']
    })    
 }
 componentDidUpdate(prevProps){
    //more code here later...
 }
 render() {
    return (
      <storeContext.Provider value={this.state}>
        {this.props.children}
      </storeContext.Provider>
    );
  }
} 