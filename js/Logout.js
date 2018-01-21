import React from 'react';
import {
  Link
} from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router';

export default class Logout extends React.Component {


  constructor(props) {
    super(props);
  }
  componentWillMount() {     
    axios.post('/api/logout/', {      
      jwt: localStorage.getItem('jwt')
    })
    .then((response) => {
      localStorage.removeItem('jwt');
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  render() {
    return <Redirect push to="/" />;
  }
}

