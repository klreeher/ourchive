import React from 'react';
import {
  Link
} from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router';

export default class LoginForm extends React.Component {


  constructor(props) {
    super(props);
    this.state = {loginToken: "", userName: "", password: "", isLoggedIn: false};
    this.setUserName = this.setUserName.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.login = this.login.bind(this);
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  setUserName(evt) {
    this.setState({
      userName: evt.target.value
    });
  }
  setPassword(evt) {
    this.setState({
      password: evt.target.value
    });
  }

  login(evt) {
    evt.preventDefault();
    axios.post('/api/login/', {
      userName: this.state.userName, 
      password: this.state.password
    })
    .then((response) => {
      localStorage.setItem('jwt', response.data);
      this.setState({redirect: true});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }
    return (
        <div>
          <div className="panel panel-default">
            <div className="panel-body">
                <div className="form-group">
                  <label htmlFor="userName">Username</label>
                  <input id="userName" 
                    name="userNameInput" onChange={this.setUserName} className="form-control"></input>
                </div>              
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input id="password" className="form-control" type="password"
                  onChange={this.setPassword}></input>
                </div>
                <div className="form-group">
                  <button onMouseDown={evt => this.login(evt)} className="btn btn-default">Submit</button>
                </div>
            </div>
          </div>
      </div>

    );
  }
}

