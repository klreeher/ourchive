import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  Nav,
  Navbar,
  NavItem,
  NavDropdown
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
    this.state = {loggedIn: false};
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
      })
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }
  render() {

    const navbarLoggedIn = (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">React-Bootstrap</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
        <IndexLinkContainer to="/works">
          <NavItem>Works</NavItem>
        </IndexLinkContainer>
            
        <NavItem href="/create/work">
            New Work
        </NavItem>       
       
        <IndexLinkContainer to="/bookmark/1">
          <NavItem>Bookmarks</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to="/bookmarks/new">
          <NavItem>New Bookmark</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to="/my-profile">
          <NavItem>My Profile</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to="/user/1/show">
          <NavItem>User Profile</NavItem>
        </IndexLinkContainer>
        <NavItem href="/" onClick={evt => this.logout(evt)}>Logout</NavItem>
        </Nav>
      </Navbar>
    );

    const navbarLoggedOut = (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">React-Bootstrap</a>
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
        <IndexLinkContainer to="/login">
          <NavItem>Login</NavItem>
        </IndexLinkContainer>
        </Nav>
      </Navbar>
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