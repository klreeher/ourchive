import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  Nav,
  Navbar,
  NavItem,
  NavDropdown,
  Modal,
  Button,
  MenuItem
} from 'react-bootstrap';
import axios from 'axios';
import { IndexLinkContainer } from 'react-router-bootstrap';
import { withAlert } from 'react-alert';

class NavbarInternal extends React.Component {

  componentDidMount() {
    var state = localStorage.getItem('jwt');
    var admin = localStorage.getItem('admin');
    var id = localStorage.getItem('user_id');
    var token = null;
    if (state != null) {
      this.props.updateCsrf()

    }
    this.setState({
        loggedIn: state != null,
        admin: admin != null && admin.toLowerCase() === "true",
        userId: id
      })

  }
  constructor(props)
  {
    super(props);
    this.state = {showModal: false};
    this.setUserName = this.setUserName.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setResetToken = this.setResetToken.bind(this);
  }

  logout(evt)
  {
    axios.post('/api/user/logout/', {empty: "empty"}, {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
      'CSRF-Token': this.props.csrf
    }})
    .then((response) => {
      localStorage.removeItem('jwt');
      localStorage.removeItem('admin');
      localStorage.removeItem('friendly_name')
      this.setState({
        loggedIn: false
      });
      this.props.updateUser();
    })
    .catch(function (error) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('admin');
      localStorage.removeItem('friendly_name')
      this.setState({
        loggedIn: false
      });
      this.props.updateUser();
    });

  }

  setUserName(evt) {
    this.setState({
      userName: evt.target.value
    });
  }
  setEmail(evt) {
    this.setState({
      email: evt.target.value
    });
  }
  setPassword(evt) {
    this.setState({
      password: evt.target.value
    });
  }

    setResetToken(evt) {
      this.setState({
        resetToken: evt.target.value
      });
    }

  showLogin(evt)
  {
    evt.target.blur()
    this.setState({ showModal: true })
  }
  showRegister(evt)
  {
    evt.target.blur()
    this.setState({ showRegisterModal: true });
  }

  resetPassword(evt){
    evt.target.blur()
    axios.post('/api/user/'+this.state.userName+'/reset', {
    })
    .then((response) => {
      this.setState({showRegisterModal: false,
      showLoginModal: false,
      showResetModal: true})

    })
    .catch(function (error) {
      this.props.alert.show('An error has occurred: '+ error, {
          timeout: 6000,
          type: 'error'
        })
      this.setState({showRegisterModal: false});
    }.bind(this));
  }
  performReset(evt) {
    evt.target.blur()
    axios.post('/api/user/'+this.state.userName+'/reset/'+this.state.resetToken, {
    username: this.state.userName,
    password: this.state.password
    })
    .then((response) => {
      this.setState({showRegisterModal: false,
      showLoginModal: true,
      showResetModal: false})

    })
    .catch(function (error) {
      this.props.alert.show('An error has occurred: '+ error, {
          timeout: 6000,
          type: 'error'
        })
      this.setState({showRegisterModal: false});
    }.bind(this));
  }
  trySubmit(evt) {
    if(evt.keyCode == 13){
        this.handleLogin(evt)
    }
  }
  handleLogin(evt) {
    if (this.state.userName != "" && this.state.userName != null
      && this.state.password != "" && this.state.password != null)
    {
      axios.post('/api/user/login/', {
      username: this.state.userName,
      password: this.state.password
      })
      .then((response) => {
        localStorage.setItem('jwt', response.data['auth_token']);
        localStorage.setItem('admin', response.data['admin'])
        localStorage.setItem('friendly_name', response.data['username'])
        this.props.updateUser();
        this.setState({
          userName: "",
          password: "",
          email: "",
          loggedIn: true,
          showModal: false,
          admin: response.data['admin'],
          userId: 1
        });

      })
      .catch(function (error) {
        this.props.alert.show('An error has occurred. Please validate your username & password and try again.', {
            timeout: 6000,
            type: 'error'
          })
        this.setState({showModal: false});
      }.bind(this));
    }
    else
    {
        this.props.alert.show('Please verify that username and password are filled in.', {
            timeout: 6000,
            type: 'error'
          })
        this.setState({ showModal: false });

    }

  }

  handleRegister(evt) {
    if (this.state.userName != "" && this.state.userName != null
      && this.state.password != "" && this.state.password != null
      && this.state.email != "" && this.state.email != null)
    {
      axios.post('/api/user/register/', {
      username: this.state.userName,
      password: this.state.password,
      email: this.state.email
      })
      .then((response) => {
        localStorage.setItem('jwt', response.data['auth_token']);
        localStorage.setItem('friendly_name', response.data['username'])
        this.props.updateUser();
        this.setState({
          userName: "",
          password: "",
          loggedIn: true,
          showRegisterModal: false,
          userId: 1
        });

      })
      .catch(function (error) {
        this.props.alert.show('An error has occurred: '+ error, {
            timeout: 6000,
            type: 'error'
          })
        this.setState({showRegisterModal: false});
      }.bind(this));
    }
    else
    {
        this.props.alert.show('Please verify that username, password, and email are all filled in.', {
            timeout: 6000,
            type: 'error'
          })
        this.setState({ showRegisterModal: false });
    }

  }

  closeModals(evt) {
    this.setState({
      showModal: false,
      showRegisterModal: false,
      showResetModal: false
    })
  }

  render() {

    const navbarLoggedIn = (
      <div className="col-xs-8 col-md-12">
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">ourchive</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav>

        <NavItem href="/create/work">
            New Work
        </NavItem>

        {this.state.admin &&
            <NavItem href="/admin">Admin</NavItem>
        }

        <NavDropdown eventKey={3} title="User" id="user-nav-dropdown">
          <IndexLinkContainer to="/bookmarks/new">
            <NavItem>New Bookmark</NavItem>
          </IndexLinkContainer>
          <IndexLinkContainer to="/my-profile">
            <NavItem>My Profile</NavItem>
          </IndexLinkContainer>
          <IndexLinkContainer to={"/user/messages"}>
            <NavItem>Messages</NavItem>
          </IndexLinkContainer>
          <IndexLinkContainer to="/notifications">
            <NavItem>Notifications</NavItem>
          </IndexLinkContainer>
        </NavDropdown>

        <NavItem onClick={evt => this.logout(evt)}>Logout</NavItem>
        </Nav>
        </Navbar.Collapse>
      </Navbar>
      </div>
    );

    const navbarLoggedOut = (
    <div className="col-xs-8 col-md-12">
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">ourchive</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
        <NavItem onClick={evt => this.showLogin(evt)}>Login</NavItem>
        <NavItem onClick={evt => this.showRegister(evt)}>Register</NavItem>
        </Nav>
      </Navbar>

      <Modal show={this.state.showModal} onHide={evt => this.closeModals(evt)}>
          <Modal.Header closeButton>
            <Modal.Title>Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="panel panel-default">
                <div className="panel-body">
                    <div className="form-group">
                      <label htmlFor="login_userName">Username</label>
                      <input id="login_userName" onKeyUp={evt => this.trySubmit(evt)} ref="userInput"
                        name="userNameInput" onChange={this.setUserName} className="form-control"></input>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input id="password" className="form-control" type="password" ref="pwInput"
                      onChange={this.setPassword} onKeyUp={evt => this.trySubmit(evt)}></input>
                    </div>
                    <button className="btn btn-link" onClick={evt => this.resetPassword(evt)}>Forgot password?</button>
                    <div className="form-group">
                      <button onClick={evt => this.handleLogin(evt)} className="btn btn-default" >Submit</button>
                    </div>
                </div>
              </div>
          </div>

          </Modal.Body>
        </Modal>

        <Modal show={this.state.showRegisterModal} onHide={evt => this.closeModals(evt)}>
          <Modal.Header closeButton>
            <Modal.Title>Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="panel panel-default">
                <div className="panel-body">
                    <div className="form-group">
                      <label htmlFor="userName">Email</label>
                      <input id="email"
                        name="emailInput" onChange={this.setEmail} className="form-control"></input>
                    </div>
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
                      <button onClick={evt => this.handleRegister(evt)} className="btn btn-default">Submit</button>
                    </div>
                </div>
              </div>
          </div>

          </Modal.Body>
        </Modal>

        <Modal show={this.state.showResetModal} onHide={evt => this.closeModals(evt)}>
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                      <label htmlFor="token">Reset Token</label>
                      <input id="token" className="form-control"
                      onChange={this.setResetToken}></input>
                    </div>
                    <div className="form-group">
                      <button onClick={evt => this.performReset(evt)} className="btn btn-default">Submit</button>
                    </div>
                </div>
              </div>
          </div>

          </Modal.Body>
        </Modal>
      </div>
    );

    if (this.state.loggedIn)
    {
      return (navbarLoggedIn);
    }
    else
    {
      return (navbarLoggedOut);
    }
  }
}

export default withAlert(NavbarInternal)
