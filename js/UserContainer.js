import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';
import BookmarkItem from './BookmarkItem';
import PaginationControl from './PaginationControl';

export default class UserContainer extends React.Component {
	constructor(props) {    
	  	super(props);	  	
	    this.state = {user: this.props.user, works: this.props.works, 
	    	bookmarks: this.props.bookmarks, curator: this.props.curator};
    }

    componentWillMount() { 
    	//do things
	}
	componentWillUpdate(nextProps, nextState)
	{
	
	}
	componentWillReceiveProps(nextProps) {
	  this.setState({ user: nextProps.user, works: nextProps.works,
	  	bookmarks: nextProps.bookmarks, curator: nextProps.curator});  
	}

    render() {
    return (

      <Tabs defaultActiveKey={1} id="user-container-nav">
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
			    	{this.state.works && this.state.works.map(work => 
			    		<div className="list-row panel panel-default" key={work.id}>
			    			<WorkStub work={work}/>
			    		</div>
			    		)}
			  	</div>
			  	<div className="row">
	        		<PaginationControl paginationName="work" previousPage={this.props.previousPage} nextPage={this.props.nextPage}
                      totalPages={this.props.totalWorkPages} currentPage={this.props.currentWorkPage}/>
	        	</div>
	    	</div>
	    </Tab>
    	<Tab eventKey={3} title="Bookmarks">
    		<div className="col-md-12">
    		<br/>
    			<div className="list">
			        {this.state.bookmarks.map(bookmark => 
			          <div key={bookmark.key}>
			            <BookmarkItem bookmark={bookmark} curator={this.state.curator}/>
			          </div>
			        )}
			    </div>
	        </div>
    	</Tab>
  	  </Tabs>

    );
  }

}