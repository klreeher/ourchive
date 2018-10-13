import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';
import BookmarkStub from './BookmarkStub';
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
    	<div>
	      <Tabs defaultActiveKey={1} id="user-container-nav">
	        <Tab eventKey={1} title="Profile">
		    	<div className="col-md-12">
			        	<div className="row">
			        		<div className="col-md-4">
			        			<h3>{this.state.user.username}</h3>
			        		</div>	        		
			        	</div>
			        	<div className="row">
			        		<div className="col-md-2">
			        			About:
			        		</div>
			        		<div className="col-md-10">
			        			{this.state.user.bio}
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
		        		{this.state.works.length > 0 && <PaginationControl paginationName="work" previousPage={this.props.previousPage} nextPage={this.props.nextPage}
	                      totalPages={this.props.totalWorkPages} currentPage={this.props.currentWorkPage}/>}
		        	</div>
		    	</div>
		    </Tab>
	    	<Tab eventKey={3} title="Bookmarks">
	    		<div className="col-md-12">
	    		<br/>
	    			<div className="list">
				        {this.state.bookmarks && this.state.bookmarks.map(bookmark => 
				          <div key={bookmark.key}>
	                        <BookmarkStub bookmark={bookmark} user={this.props.user} curator={bookmark.curator} ref={"bookmark_"+bookmark.id}/>
				          </div>
				        )}
				    </div>
				    <div className="row">
		        		{this.state.bookmarks && this.state.bookmarks.length > 0 && <PaginationControl paginationName="bookmark" previousPage={this.props.previousPage} nextPage={this.props.nextPage}
	                      totalPages={this.props.totalBookmarkPages} currentPage={this.props.currentBookmarkPage}/>}
		        	</div>
		        </div>
	    	</Tab>
	  	  </Tabs>
	  	</div>

    );
  }

}