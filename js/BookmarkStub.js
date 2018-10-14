import React from 'react';
import axios from 'axios';
import {
  Link
} from 'react-router-dom';
import TagList from './TagList';
import ReactDOM from 'react-dom';

export default class BookmarkStub extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {bookmark: props.bookmark, curator: props.curator, viewer_is_creator: true, newCommentText: "",
    		toggleCommentsText: "Show Comments", showComments: false,
	    	user: props.user};
	    if (this.state.bookmark.work === undefined) {
	    	this.state.bookmark.work = {}
	    }
    }

  render() {
    return (
    	
    	<div className="list-row panel panel-default">
    	{this.state.bookmark.curator != undefined &&
    	  <div className="panel-body">
	      	<div className="row">
	      		<div className="col-sm-5"><Link to={"/bookmark/"+this.state.bookmark.id}>{this.state.bookmark.curator_title}</Link> curated by <Link to={"/user/"+this.state.curator.curator_id+"/show"}>{this.state.curator.curator_name}</Link></div>
		    </div>
	      	<div className="row">
	      		<div className="col-sm-11 col-sm-offset-1">
		        	Bookmarked work: {this.state.bookmark.work.title} by {this.state.bookmark.work.username}
        		</div>        			
	        </div>
	        <div className="row">
	            <div className="col-md-12">{this.state.curator.curator_name}'s rating: {this.state.bookmark.rating}</div>	
	        </div>
	         <div className="row">
	             {this.state.bookmark.tags.map(tag => 
			        <div className="row" key={tag.id}>
				      <div className="col-xs-9 col-md-12">
			              <ul className="list-inline">
			                <TagList tag_category={tag.label} category_id={tag.id} tags={tag.tags}/>
			              </ul>
			          </div> 
			        </div>
			      )}		            
	        </div>
          </div> }
          {
          	this.state.bookmark.curator === undefined && <div></div>
          }
  		</div>
      
    );
  }

}