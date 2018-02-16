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
        <h2>Home - Hello World</h2>
        <Search user={this.props.user}/>
      </div>

    );
  }
}

