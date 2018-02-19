import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import TagList from './TagList';
import ReactDOM from 'react-dom';

export default class BookmarkStub extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {bookmark: props.bookmark, curator: props.curator, viewer_is_creator: true, newCommentText: "",
    		toggleCommentsText: "Show Comments", showComments: false,
	    	user: props.user};
    }

  render() {
    return (
    	<div>
    	  <div className="panel panel-default">
	      	<div className="panel-heading">
	      		{this.state.bookmark.curator_title}
	      		{this.state.viewer_is_creator && 
		            		<div className="pull-right"> 
		            			<button className="btn btn-link">Edit</button> | <button className="btn btn-link">Delete</button>
		            		</div>
		            	}
	      	</div>
	      	<div className="panel-body">
		      	<div className="row">
		      		<div className="col-md-12">
		        		<blockquote>
			        		<div className="row">
			        			<div className="col-md-12">{this.state.bookmark.work.title} by {this.state.bookmark.work.creator}</div>
			        		</div>
			        		<div className="row">
			        			<div className="col-md-4">Complete? {this.state.bookmark.work.is_complete ? "True" : "False"}</div>
			        			<div className="col-md-4">Word count: {this.state.bookmark.work.word_count}</div>
			        			<div className="col-md-4">Chapter count: {this.state.bookmark.work.chapter_count}</div>
			        		</div>
		        		</blockquote>	
	        		</div>        			
		        </div>
		        <div className="row">
		            <div className="col-md-12">{this.state.curator.curator_name}'s rating: {this.state.bookmark.rating}</div>
		            	
		        </div>
		        <div className="row">
		            <div className="col-md-12">{this.state.curator.curator_name} says...</div>
		        </div>			        
		        <div className="row">
		            <div className="col-xs-11 col-xs-offset-1">
		                {this.state.bookmark.description}
		            </div>
		        </div>	
		         <div className="row">
		             {this.state.bookmark.tags.map(tag => 
				        <div className="row" key={Math.random()}>
				        <div className="col-md-12">
				            <ul className="list-inline">
				              <TagList tag_category={Object.keys(tag)} tags={Object.values(tag)} underEdit={false}/>
				            </ul>
				        </div> 
				        </div>
				      )}		            
		        </div>
	          </div> 
	  		</div>
    	</div>
      
    );
  }

}