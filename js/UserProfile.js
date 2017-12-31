import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';
import UserContainer from './UserContainer';


export default class UserProfile extends React.Component {
	constructor(props) {    
	  	super(props);	  	
	    this.state = this.state = {user: {}, works: []};
    }

    fetchUser(userId)
  	{
	  	axios.get('/api/user/'+userId)
	      .then(function (response) {
	      	localStorage.setItem('profile', JSON.stringify(response.data));
	        this.setState({
	          user: response.data
	        });  

	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
  	}

    getUser()
    {
    	
    	var userProfile = localStorage.getItem('profile');
    	if (userProfile == null)
    	{
    		//todo: this means user should log in probably?
    		this.fetchUser(1);
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

    getWorks()
    {
    	//todo add axios
    }

    componentWillMount() { 
    	this.getUser();
    	this.getWorks();
  	}

    render() {
    return (

      <UserContainer user={this.state.user} works={this.state.works}/>

    );
  }

}