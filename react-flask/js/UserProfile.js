import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';


export default class UserProfile extends React.Component {
	constructor(props) {    
	  	super(props);
	    this.state = this.state = {user: {}};
    }

    getUser()
    {
    	var user = {
		
		  "userName": "elena",
	      "aboutMe": "HATE EFFORT, LOVE BADFIC",
	      "lastLogin": "2017-07-04",
	      "works_count": 25,
	      "bookmarks_count": 30
	  	};
    	var userProfile = localStorage.getItem('profile');
    	if (userProfile == null)
    	{
    		localStorage.setItem('profile', JSON.stringify(user));
    		this.setState({
	          user: user
	        }); 
	        console.log("USER PROFILE WAS NULL");
    	} 
    	else
    	{
    		this.setState({
	          user: JSON.parse(userProfile)
	        }); 
	        console.log("USER PROFILE WAS NOT NULL");
    	}
    }

    componentWillMount() { 
    	this.getUser();
  	}

    render() {
    return (
	    <div className="panel panel-default">
        	<div className="panel-body">
	        	<div className="row">
	        		<div className="col-md-4">
	        			<h3>{this.state.user.userName}</h3>
	        		</div>	        		
	        	</div>
	        	<div className="row">
	        		<div className="col-md-2">
	        			About:
	        		</div>
	        		<div className="col-md-10">
	        			{this.state.user.aboutMe}
	        		</div>
	        	</div>
	        	<div className="row">
	        		<div className="col-md-2">
	        			Last Login:
	        		</div>
	        		<div className="col-md-10">
	        			{this.state.user.lastLogin}
	        		</div>
	        	</div>
	        	<div className="row">
	        		<div className="col-md-2">
	        			Works:
	        		</div>
	        		<div className="col-md-10">
	        			{this.state.user.works_count}
	        		</div>
	        	</div>
	        	<div className="row">
	        		<div className="col-md-2">
	        			Bookmarks:
	        		</div>
	        		<div className="col-md-10">
	        			{this.state.user.bookmarks_count}
	        		</div>
	        	</div>
        	</div>
	    </div>
    );
  }

}