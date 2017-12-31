import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';


export default class UserProfile extends React.Component {
	constructor(props) {    
	  	super(props);	  	
	    this.state = this.state = {user: {}, works: []};
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

      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Profile">
	    	<div className="col-md-12">
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
    	</Tab>
    	<Tab eventKey={2} title="Works">
    		<div className="col-md-12">
    			<br/>
	    		<div className="list">
			    	{this.state.works.map(work => 
			    		<div className="list-row panel panel-default" key={work.key}>
			    			<WorkStub work={work}/>
			    		</div>
			    		)}
			  	</div>
	    	</div>
	    </Tab>
    	<Tab eventKey={3} title="Bookmarks">
    		<div className="col-md-12">

	        		Tab 3 content
	        </div>
    	</Tab>
  	  </Tabs>

    );
  }

}