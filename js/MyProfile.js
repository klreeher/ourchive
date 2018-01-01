import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';
import UserContainer from './UserContainer';
import EditDeleteButtons from './EditDeleteButtons';


export default class MyProfile extends React.Component {
	constructor(props) {    
	  	super(props);	  	
	    this.state = this.state = {user: {}, works: [], bookmarks: []};
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
    	} 
    	else
    	{
    		this.setState({
	          user: JSON.parse(userProfile)
	        }); 
    	}
    }

    getWorks(index)
    {
    	//todo add axios
    }
    getBookmarks(index)
    {
    	//todo add axios
    }
    componentWillMount() { 
    	this.getUser();
    	this.getWorks(0);
    	this.getBookmarks(0);
  	}

    render() {
    return (
    	<div>
    		<EditDeleteButtons viewer_is_creator={true} editHref={"user/"+this.state.user.userId+"/edit"}/>
    		<br/>
    		<br/>
      		<UserContainer user={this.state.user} works={this.state.works} bookmarks={this.state.bookmarks}/>
      	</div>
    );
  }

}