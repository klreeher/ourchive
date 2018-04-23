import React from 'react';
import {
  Link
} from 'react-router-dom';
import axios from 'axios';
import Search from './Search';
import { withAlert } from 'react-alert'

class Home extends React.Component {


  constructor(props) {
    super(props);
  }
  componentWillMount() {     
    
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12"><h1>Ourchive. <small>A multi-media archive for everyone.</small></h1></div>
        </div>
        <Search user={this.props.user}/>
        <br/>
      </div>

    );
  }
}

export default withAlert(Home)
