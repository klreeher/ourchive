import React from 'react';
import {
  Link
} from 'react-router-dom';

var Nav = React.createClass({

  componentDidMount: function () {
    //do something here
  },
  render() {
    return (
      <div className="nav">
    	<ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/works">Works</Link></li>
        <li><Link to="/bookmarks">Bookmarks</Link></li>
      </ul>
  	  </div>
    );
  }
});

export default Nav;