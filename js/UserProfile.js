import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';
import UserContainer from './UserContainer';


export default class UserProfile extends React.Component {
	constructor(props) {    
	  	super(props);	  	
	    this.state = this.state = {user: {}, works: [], bookmarks: []};
    }

    fetchUser(userId)
  	{
	  	axios.get('/api/user/'+userId)
	      .then(function (response) {
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
    	this.fetchUser(this.props.match.params.userId);
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

      <UserContainer user={this.state.user} works={this.state.works} bookmarks={this.state.bookmarks}/>

    );
  }

}