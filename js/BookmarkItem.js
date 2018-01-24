import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import TagList from './TagList';
import NewComment from './NewComment';
import Comment from './Comment';

export default class BookmarkItem extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {bookmark: props.bookmark, viewer_is_creator: true, newCommentText: "",
    		toggleCommentsText: "Show Comments", showComments: false,
	    	user: props.user};
    	this.addComment = this.addComment.bind(this)
    	this.toggleComments = this.toggleComments.bind(this)
    	this.updateNewCommentText = this.updateNewCommentText.bind(this)
    }

  toggleComments(event)
  {
    event.preventDefault();
    event.target.blur();
    var showComments = !this.state.showComments;
    var toggleText = showComments ? "Hide Comments" : "Show Comments";
    this.setState({
      showComments: showComments,
      toggleCommentsText: toggleText
    })
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
        	<div className="panel-body">
				<div className="col-xs-8">
					<div className="row">
						<div className={this.state.viewer_is_creator ? "viewer-creator row" : "viewer row"}>
				          <div className="col-xs-1">
				            <button>Edit</button>				            
				          </div>
				          <div className="col-xs-1">
				          	<button>Delete</button>
				          </div>
				       	</div>
					</div>
					<br/>
      				<div className="row">
			    		<div className="col-md-2">
			        		<div>{this.state.bookmark.chapter_image}
			            	<br/>
			            	<br/>
			            	<br/>
			        		</div>
			    		</div>
			    		<div className="col-md-8">
			        		<div className="row">
			            		<div className="col-md-12">
			                		<div><h3>{this.state.bookmark.title} BY {this.state.bookmark.creator}</h3></div>
			            		</div>
			        		</div>
			        		<div className="row">				        	
			            		<div className="col-md-11 col-md-offset-1">
			                		<div>{this.state.bookmark.summary}</div>
			            		</div>
			        		</div>
						</div>
					</div>
			        <div className="row">
			            <div className="col-md-12">
			                <div><h3>{this.state.bookmark.rating}</h3></div>
			            </div>
			        </div>
			        <div className="row">
			            <div className="col-md-12">
			                <div>
			                	{this.state.bookmark.curator} says...
			                </div>
			            </div>
			        </div>	
			        <br/>			        
			        <div className="row">
			            <div className="col-md-11 col-md-offset-1">
			                <div>
			                	{this.state.bookmark.description}
			                </div>
			            </div>
			        </div>			      			
		  			<br/>
		  			<div className="row">
			            <div className="col-md-12">
			                <div>
			                	If you like this, {this.state.bookmark.curator} recommends...
			                </div>
			            </div>
			            
			        </div>
			        <div className="row">
				        <div className="col-md-11 col-md-offset-1">
					        <ul className="list-inline">
						        {this.state.bookmark.links.map(link => 
						          <li>
						         	<div key={link}>
						            	{link}
						          	</div>
						          </li>
						        )}
						    </ul>
				        </div>
				    </div>
			        <div className="row">
			             {this.state.bookmark.tags.map(tag => 
					        <div className="row">
					        <div className="col-md-12">
					            <ul className="list-inline">
					              <TagList tag_category={Object.keys(tag)} tags={Object.values(tag)}/>
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
			                <div key={comment.id} className="col-md-12">
			                  <Comment comment={comment} user={this.props.user} chapterId={this.state.bookmark.id}/>
			                </div>
			                  
			                )}

			            </div> 
			          </div>    
		        </div>
		        <div className="col-xs-4">
		        	<div className="row">
		        		MY SIDEBAR BRINGS ALL THE BOYS TO THE YARD
		        	</div>
		        	<div className="row">
		        		and they're like, IT'S BETTER THAN YOURS
		        	</div>
		        	<div className="row">
		        		DAMN RIGHT
		        	</div>
		        	<div className="row">		        	
		        		<h3>IT'S BETTER THAN YOURS</h3>
		        	</div>
		        </div>
		      </div>	
		  </div>
		</div>
    );
  }

}