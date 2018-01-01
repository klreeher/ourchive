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
	          user: response.data,
              bookmarks: response.data.bookmarks,
              works: response.data.works
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

    getWorks(index, userId)
    {
        axios.get('/api/work/creator/'+userId)
          .then(function (response) {
            this.setState({
              works: response.data.works
            });  

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }
    getBookmarks(index, userId)
    {
        axios.get('/api/bookmark/curator/'+userId)
          .then(function (response) {
            this.setState({                
              bookmarks: response.data.bookmarks
            });  

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }

    componentWillMount() { 
    	this.getUser();
    	this.getWorks(0, this.props.match.params.userId);
    	this.getBookmarks(0, this.props.match.params.userId);
  	}

    render() {
    return (

      <UserContainer user={this.state.user} works={this.state.works} bookmarks={this.state.bookmarks}/>

    );
  }

}