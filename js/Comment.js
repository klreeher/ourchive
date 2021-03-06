import React from 'react';
import {
  Link
} from 'react-router-dom';
import NewComment from './NewComment';
import axios from 'axios';
import { withAlert } from 'react-alert';

class Comment extends React.Component {


  constructor(props) {
    super(props);
    this.state = {comment: props.comment, user: props.user, chapterId: props.chapterId, bookmarkId: props.bookmarkId};
    this.showReply = this.showReply.bind(this);
    this.addComment = this.addComment.bind(this);
    this.updateNewCommentText = this.updateNewCommentText.bind(this);
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  addComment(event)
  {
    event.preventDefault()
    var originalId = this.state.comment.id != null ? this.state.comment.id : 0;
    if (this.state.newCommentText == null || this.state.newCommentText == "") return;
    var commentUser = localStorage.getItem('friendly_name') != null && localStorage.getItem('friendly_name') != "" ? localStorage.getItem('friendly_name') : "Anonymous";
    var newComment = {text: this.state.newCommentText, userName: commentUser, comments: [],
      parentCommentId: this.state.comment.id};
    var apiRoute = "/api/comment/reply/";    
    axios.post(apiRoute, {
      text: this.state.newCommentText,
      parent_id: this.state.comment.id
    }, {   
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
      'CSRF-Token': this.props.csrf
    }})
    .then(function (response) {
      newComment.id = response.data["id"]
      var original = this.state.comment;
      original.comments.push(newComment);
      this.setState({
        comment: original,
        newCommentText: "",
        showReply: false
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
  showReply(event)
  {
    this.setState(
    {
      showReply: true
    })
    event.target.blur();
  }

  render() {
    return (
      <div>
      <br/>
        <div className="row comment-header"><strong>{this.state.comment.userName}</strong></div>
        <div className="row comment-body">
          <div className="col-xs-8 col-md-12 render-linebreak">
            {this.state.comment.text}
            <br/>
            <div className="row pull-right">
              <button className="btn btn-link" onClick={this.showReply}>Reply</button>
            </div>
          </div>
        </div>
          
          <div className={this.state.showReply ? "viewer-creator" : "viewer"}>
            <div className="row comment-body">
              <NewComment comment={this.state.comment} user={this.props.user} 
              addComment={this.addComment} updateNewCommentText={this.updateNewCommentText}
              newCommentText={this.state.newCommentText}/>
            </div>
          </div>
          <div className="row">
            {this.state.comment.comments.map(comment => 
              <div key={comment.id} className="col-xs-10">
                <Comment comment={comment} user={this.props.user}/>
              </div>              
              )}
          </div>
      </div>
    );
  }
}

export default withAlert(Comment)

