import React from 'react';
import {
  Link
} from 'react-router-dom';
import axios from 'axios';
import Search from './Search';

export default class Home extends React.Component {


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
      </div>

    );
  }
}

