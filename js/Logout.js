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
      this.setState({redirect: true});
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  login(evt) {
    evt.preventDefault();
    
  }

  render() {
    return <Redirect push to="/" />;
  }
}

