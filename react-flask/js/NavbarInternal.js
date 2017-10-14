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
    <IndexLinkContainer to="/bookmarks">
      <NavItem>Bookmarks</NavItem>
    </IndexLinkContainer>
    </Nav>
  </Navbar>
    );
  }
});

export default NavbarInternal;