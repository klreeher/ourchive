import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import TagList from './TagList';
import NewComment from './NewComment';
import Comment from './Comment';
import ReactDOM from 'react-dom';

export default class BookmarkItem extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {bookmark: props.bookmark, curator: props.curator, viewer_is_creator: true, newCommentText: "",
    		toggleCommentsText: "Show Comments", showComments: false,
	    	user: props.user};
    	this.addComment = this.addComment.bind(this)
    	this.toggleComments = this.toggleComments.bind(this)
    	this.updateNewCommentText = this.updateNewCommentText.bind(this)
    }

  toggleComments(event, commentId)
  {
    if (event != null) 
    {
      event.preventDefault();
      event.target.blur();
    }
    var showComments = !this.state.showComments;
    var toggleText = showComments ? "Hide Comments" : "Show Comments";
    this.setState({
      showComments: showComments,
      toggleCommentsText: toggleText
    }, () => {
        if (commentId > 0)
          ReactDOM.findDOMNode(this.refs["comment_"+commentId]).scrollIntoView();
      }
    )
  }
  addComment(event)
  {
    //TODO replace with db id
    if (this.state.newCommentText == null || this.state.newCommentText == "") return;
    var bookmarkUser = this.state.user != null && this.state.user != "" ? this.state.user : "Anonymous";
    var newComment = {text: this.state.newCommentText, id: Math.floor(Math.random() * 100) + this.state.bookmark.id, userName: bookmarkUser, comments: [],
      parentId: null, bookmarkId: this.state.bookmark.id};
    var original = this.state.bookmark;
    original.comments.push(newComment);
    this.setState({
      bookmark: original,
      newCommentText: ""
    });
  }
  updateNewCommentText(event)
  {
    this.setState(
    {
      newCommentText: event.target.value
    })
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
		        	<div className="col-md-12">If you like this, {this.state.curator.curator_name} recommends...</div>            
		        </div>
		        <div className="row">
			        <div className="col-xs-11 col-xs-offset-1">
				        <ol className="list-inline">
					        {this.state.bookmark.links.map(link => 					          
					         	<div key={link.link}>
					         	  <li>
					            	<a href={link.link}>{link.text}</a>
					              </li>
					          	</div>					          
					        )}
					    </ol>
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

		        <div className="row">
		            <div className="col-md-12">
		                Leave a comment:
		            </div>
		          </div>          
		          <NewComment comment={null} user={this.props.user} 
		            addComment={this.addComment} updateNewCommentText={this.updateNewCommentText}
		            newCommentText={this.state.newCommentText}/>
		          <br/>
		          <div className="row">
		            <button className="btn btn-link btn-lg" onClick={this.toggleComments}>{this.state.toggleCommentsText}</button>
		          </div>
		          <div className={this.state.showComments ? "viewer-creator" : "viewer"}>
		            <div className="row">
		              <div className="col-md-12">
		                <h3>Comments</h3>
		              </div>
		            </div>   
		            <div className="row">
		              {this.state.bookmark.comments.map(comment => 
		                <div key={comment.id} className="col-md-12" ref={"comment_"+comment.id}>
		                  <Comment comment={comment} user={this.props.user} chapterId={this.state.bookmark.id}/>
		                </div>
		                  
		                )}

		            </div> 
		          </div>  
	          </div> 
	  		</div>
    	</div>
      
    );
  }

}