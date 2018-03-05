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
	    this.state = this.state = {user: {}, works: [], bookmarks: [], curator: []};
        this.getUser = this.getUser.bind(this);
        this.getWorks = this.getWorks.bind(this);
        this.getBookmarks = this.getBookmarks.bind(this);
    }

    fetchUser(userId)
  	{
	  	axios.get('/api/user/'+userId)
	      .then(function (response) {
	      	localStorage.setItem('profile', JSON.stringify(response.data));
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
    	
    	var userProfile = localStorage.getItem('profile');
    	if (userProfile == null)
    	{
    		//todo: this means user should log in probably?
    		this.fetchUser(1);
    	} 
    	else
    	{
            var userData = JSON.parse(userProfile);
            this.getWorks(0, userData.userId);
            this.getBookmarks(0, userData.userId);
    		this.setState({
	          user: userData
	        }); 
    	}
    }

    getWorks(index, userId)
    {
    	axios.get('/api/work/creator/'+userId)
          .then(function (response) {
            this.setState({
              works: response.data
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
              bookmarks: response.data.bookmarks,
              curator: response.data.curator
            });  

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }
    componentWillMount() { 
    	this.getUser();
  	}

    render() {
    return (
    	<div>
    		<EditDeleteButtons viewer_is_creator={true} editHref={"/user/"+this.state.user.userId+"/edit"}/>
    		<br/>
    		<br/>
      		<UserContainer user={this.state.user} works={this.state.works} bookmarks={this.state.bookmarks} curator={this.state.curator}/>
      	</div>
    );
  }

}