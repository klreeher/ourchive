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

export default class NavbarInternal extends React.Component {

  componentDidMount() {
    

  }

  componentWillMount() {
    var state = localStorage.getItem('jwt');
    this.setState({
      loggedIn: state != null
    })
  }
  constructor(props)
  {
    super(props);
    this.state = {showModal: false};
    this.setUserName = this.setUserName.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  logout(evt)
  {
    axios.post('/api/logout/', {      
      jwt: localStorage.getItem('jwt')
    })
    .then((response) => {
      localStorage.removeItem('jwt');
      this.setState({
        loggedIn: false
      });
      this.props.updateUser();
    })
    .catch(function (error) {
      console.log(error);
    });
    
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

  showLogin(evt)
  {
    this.setState({ showModal: true });
  }

  handleLogin(evt) {
    if (this.state.userName != "" && this.state.userName != null 
      && this.state.password != "" && this.state.password != null)
    {
      axios.post('/api/login/', {
      userName: this.state.userName, 
      password: this.state.password
      })
      .then((response) => {
        localStorage.setItem('jwt', response.data);
        this.props.updateUser();
        this.setState({ 
          userName: "",
          password: "",
          loggedIn: true,
          showModal: false
        });

      })
      .catch(function (error) {
        console.log(error);
      });
    }
    else
    {
        this.setState({ showModal: false });
    }
    
  }

  render() {

    const navbarLoggedIn = (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Ourchive</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
        <IndexLinkContainer to="/works">
          <NavItem>Works</NavItem>
        </IndexLinkContainer>
            
        <IndexLinkContainer to="/create/work">
            <NavItem>New Work</NavItem>
        </IndexLinkContainer>   

        <IndexLinkContainer to="/bookmark/1">
            <NavItem>Bookmarks</NavItem>
          </IndexLinkContainer>  

        <NavDropdown eventKey={3} title="User" id="user-nav-dropdown">          
          <IndexLinkContainer to="/bookmarks/new">
            <NavItem>New Bookmark</NavItem>
          </IndexLinkContainer>
          <IndexLinkContainer to="/my-profile">
            <NavItem>My Profile</NavItem>
          </IndexLinkContainer>
          <IndexLinkContainer to="/messages">
            <NavItem>Messages</NavItem>
          </IndexLinkContainer>
        </NavDropdown>      
        
        
        <IndexLinkContainer to="/user/1/show">
          <NavItem>User Profile</NavItem>
        </IndexLinkContainer>
        <NavItem onClick={evt => this.logout(evt)}>Logout</NavItem>
        </Nav>
      </Navbar>
    );

    const navbarLoggedOut = (
    <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Ourchive</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
        <IndexLinkContainer to="/works">
          <NavItem>Works</NavItem>
        </IndexLinkContainer>      
        <IndexLinkContainer to="/bookmark/1">
          <NavItem>Bookmarks</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to="/user/1/show">
          <NavItem>User Profile</NavItem>
        </IndexLinkContainer>
        <NavItem onClick={evt => this.showLogin(evt)}>Login</NavItem>
        </Nav>
      </Navbar>

      <Modal show={this.state.showModal} onHide={evt => this.handleLogin(evt)}>
          <Modal.Header closeButton>
            <Modal.Title>Log In</Modal.Title>
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
                      <button onClick={evt => this.handleLogin(evt)} className="btn btn-default">Submit</button>
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