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
	    if (props.bookmark === undefined)
	    {
	    	this.state = {bookmark: {"work": {}, "tags": [], "links": [],
	    	"id": props.match.params.bookmarkId}, curator: [], viewer_is_creator: true, newCommentText: "",
			toggleCommentsText: "Show Comments", showComments: false,
	    	user: props.user, needsLoad: true};
	    }
	    else
	    {
	    	this.state = {bookmark: props.bookmark, curator: props.curator, viewer_is_creator: true, newCommentText: "",
			toggleCommentsText: "Show Comments", showComments: false,
	    	user: props.user};
	    }
		this.addComment = this.addComment.bind(this)
		this.toggleComments = this.toggleComments.bind(this)
		this.updateNewCommentText = this.updateNewCommentText.bind(this)
		this.getBookmark = this.getBookmark.bind(this)
	}

  componentDidMount()
  {
    if (this.state.needsLoad){

    	this.getBookmark(this.state.bookmark.id); 
    }
  }

  getBookmark(bookmarkId)
  {
    axios.get('/api/bookmark/'+bookmarkId)
        .then(function (response) {
          this.setState({
            bookmark: response.data,
            viewer_is_creator: true,
            curator: response.data["curator"]
          }, () => {
            var cleaned_description = DOMPurify.sanitize(this.state.bookmark.description);
            var cleaned_work_summary = DOMPurify.sanitize(this.state.bookmark.work.work_summary);
            this.setState({
              safe_summary: cleaned_work_summary,
              safe_description: cleaned_description
            })
          });

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
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
			        			<div className="col-md-12">{this.state.bookmark.work.title} by {this.state.bookmark.work.name}</div>
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
		                {this.state.safe_description}
		            </div>
		        </div>	
				<div className="row">
		        	<div className="col-md-12">If you like this, {this.state.curator.curator_name} recommends...</div>            
		        </div>
		        {this.state.bookmark.links ? <div className="row">
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
			    </div> : <div/>}
		        <div className="row">
		             {this.state.bookmark.tags.map(tag => 
			          <div className="row" key={tag.id}>
			          <div className="col-xs-9 col-md-12">
			              <ul className="list-inline">
			                <TagList tag_category={tag.label} tags={tag.tags}/>
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
		            {this.state.bookmark.comments ? <div className="row">
		              {this.state.bookmark.comments.map(comment => 
		                <div key={comment.id} className="col-md-12" ref={"comment_"+comment.id}>
		                  <Comment comment={comment} user={this.props.user} chapterId={this.state.bookmark.id}/>
		                </div>
		                  
		                )}

		            </div> : <div/>}
		          </div>  
	          </div> 
	  		</div>
    	</div>
      
    );
  }

}