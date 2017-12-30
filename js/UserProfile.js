import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';


export default class UserProfile extends React.Component {
	constructor(props) {	    
	    var user = {
		
		  "userName": "elena",
	      "metadata": "blah blah"
	  	};
	  	super(props);
	    this.state = this.state = {user: user};
	    localStorage.setItem('profile', JSON.stringify(user));
    
    }

    render() {
    return (
	    <div>
	    	hello world
		</div>
    );
  }

}