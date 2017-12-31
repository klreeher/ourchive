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
import { IndexLinkContainer } from 'react-router-bootstrap';

var NavbarInternal = React.createClass({

  componentDidMount: function () {
    //do something here
  },
  render() {
    return (

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
    <IndexLinkContainer to="/create/work">
      <NavItem>New Work</NavItem>
    </IndexLinkContainer>
    <IndexLinkContainer to="/bookmark/1">
      <NavItem>Bookmarks</NavItem>
    </IndexLinkContainer>
    <IndexLinkContainer to="/bookmarks/new">
      <NavItem>New Bookmark</NavItem>
    </IndexLinkContainer>
    <IndexLinkContainer to="/my-profile">
      <NavItem>User Profile</NavItem>
    </IndexLinkContainer>
    </Nav>
  </Navbar>
    );
  }
});

export default NavbarInternal;