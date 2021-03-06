import React from 'react';
import axios from 'axios';
import {
  Link
} from 'react-router-dom';
import TagList from './TagList';
import NewComment from './NewComment';
import Comment from './Comment';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { withAlert } from 'react-alert';
import EditDeleteButtons from './EditDeleteButtons';

class BookmarkItem extends React.Component {
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
		this.deleteBookmark = this.deleteBookmark.bind(this)
		this.editBookmark = this.editBookmark.bind(this)
	}

	editBookmark(evt, bookmarkId)
	{
		evt.target.blur();
		this.props.history.push({
		  pathname: '/bookmarks/new/'+bookmarkId,
		  state: { bookmark: this.state.bookmark }
		})
	}

  componentDidMount()
  {
    this.getBookmark(this.state.bookmark.id); 
  }

  getBookmark(bookmarkId)
  {
    axios.get('/api/bookmark/'+bookmarkId, { headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
          'CSRF-Token': this.props.csrf
          }})
        .then(function (response) {
          this.setState({
            bookmark: response.data,
            viewer_is_creator: true,
            curator: response.data["curator"],
            id: bookmarkId
          }, () => {
          	if (this.state.bookmark.id != undefined) {
          		var cleaned_description = DOMPurify.sanitize(this.state.bookmark.description);
	            var cleaned_work_summary = DOMPurify.sanitize(this.state.bookmark.work.work_summary);
	            this.setState({
	              safe_summary: cleaned_work_summary,
	              safe_description: cleaned_description
	            })
	            var queryParams = new URLSearchParams(this.props.location.search);            
	        	var commentId = queryParams.get('commentId');
	        	var bookmarkId = queryParams.get('bookmarkId');
	        	if (commentId != null)
	        	{
	        		var comment = "comment_"+commentId;
	                var bookmark = "bookmark_"+bookmarkId;
	                this.refs[bookmark].toggleComments(null, commentId);
	        	}
          	}
            
          });

        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
        })
      }.bind(this));
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
  	event.preventDefault()
    if (this.state.newCommentText == null || this.state.newCommentText == "") return;
    var commentUser = localStorage.getItem('friendly_name') != null && localStorage.getItem('friendly_name') != "" ? localStorage.getItem('friendly_name') : "Anonymous";
    var newComment = {text: this.state.newCommentText, userName: commentUser, comments: [], bookmarkId: this.state.bookmark.id};
    var apiRoute = "/api/bookmark/comment/";
    axios.post(apiRoute, {
      text: this.state.newCommentText, 
      user_id: 1, 
      bookmark_id: this.state.bookmark.id
    }, {   
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
      'CSRF-Token': this.props.csrf
    }})
    .then(function (response) {
      	newComment.id = response.data["id"]
      	var original = this.state.bookmark;
	    original.comments.push(newComment);
	    this.setState({
	      bookmark: original,
	      newCommentText: ""
	    });
    }.bind(this))
    .catch(function (error) {
      this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
        })
    }.bind(this));
    
  }
  updateNewCommentText(event)
  {
    this.setState(
    {
      newCommentText: event.target.value
    })
  }
  deleteBookmark(evt, bookmarkId)
  {
    axios.delete('/api/bookmark/'+bookmarkId, {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
          'CSRF-Token': this.props.csrf
          }})
        .then((response) => {
          this.props.alert.show('Bookmark has been deleted.', {
            timeout: 6000,
            type: 'info'
          })
          this.props.history.push({
            pathname: '/'
          })
        })
        .catch((error) => {
          this.props.alert.show('An error has occurred.', {
            timeout: 6000,
            type: 'error'
          })
      });
  }

  render() {

    const loggedIn = this.props.user != null;
    const actions = []
    if (loggedIn && this.state.curator != undefined) {
      if (this.state.curator.curator_name === localStorage.getItem('friendly_name')) {
        var action = {}
        action.actionToDo = this.editBookmark;
        action.actionText="Update";
        action.variables=[this.state.bookmark.id]
        actions.push(action)
        var deleteAction = {}
        deleteAction.actionToDo = this.deleteBookmark;
        deleteAction.actionText="Delete";
        deleteAction.variables=[this.state.bookmark.id]
        actions.push(deleteAction)
      }
    }
    return (
    	<div>
    	{this.state.bookmark.id != undefined &&
	    	<div>
	    		{this.props.user && this.props.user.id === this.state.bookmark.user_id && 
	        		<div className="row">
	        			  <div className="col-xs-1 col-xs-offset-10">
				              <EditDeleteButtons dropdownLabel="Actions" actions={actions}/>
				          </div>
	        		</div>
		        }
		      	<div className="row">
		      		<div className="col-xs-5">{this.state.bookmark.curator_title}</div>
		      	</div>	      		
		      	<div className="row">
		      		<div className="col-md-12">
		        		<blockquote>
			        		<div className="row">
			        			<div className="col-md-12"><Link to={"/work/"+this.state.bookmark.work.id}>{this.state.bookmark.work.title}</Link> by <Link to={"/user/"+this.state.bookmark.work.user_id+"/show"}>{this.state.bookmark.work.username}</Link></div>
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
		        {this.state.safe_description && this.state.safe_description != "" ? <div>
		        <div className="row">
		            <div className="col-md-12">{this.state.curator.curator_name} says...</div>
		        </div>			        
		        <div className="row">
		            <div className="col-xs-11 col-xs-offset-1">
		                {this.state.safe_description}
		            </div>
		        </div></div> : <div></div>}
				
		        {this.state.bookmark.links && this.state.bookmark.links.length > 0 ? <div>
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
			    </div> : <div/>}
			    
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
		                  <Comment comment={comment} user={this.props.user} csrf={this.props.csrf} bookmarkId={this.state.bookmark.id}/>
		                </div>
		                  
		                )}

		            </div> : <div/>}
		          </div>  
	          </div>
	          }
		      {
		        this.state.bookmark.id === undefined && <div></div>
		      }
	  		</div>    
    );
  }

}

export default withAlert(BookmarkItem)