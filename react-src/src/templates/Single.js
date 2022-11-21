import React from 'react';
import TheLoop from '../partials/TheLoop';
import {Provider} from '../context/Context'
const Single = (props) => {
  return (
    <Provider router={props}>
    <div className="Post">
      <TheLoop />
    </div>
    </Provider>
  )
}
export default Single