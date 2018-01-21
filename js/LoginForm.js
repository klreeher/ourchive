import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class LoginForm extends React.Component {


  constructor(props) {
    super(props);
    this.state = {loginToken: "", userName: "", password: ""};
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
    //todo login!!!
  }

  render() {
    return (
        <div>
          <div className="panel panel-default">
            <div className="panel-body">
              <form>
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
              </form>
            </div>
          </div>
      </div>

    );
  }
}

