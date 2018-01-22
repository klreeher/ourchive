import React from 'react';
import {
  Link
} from 'react-router-dom';
import NewComment from './NewComment';

export default class Comment extends React.Component {


  constructor(props) {
    super(props);
    this.state = {comment: props.comment, user: props.user};
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
    var originalId = this.state.comment.id != null ? this.state.comment.id : 0;
    //todo stub getting this from the db with db generated id
    if (this.state.newCommentText == null || this.state.newCommentText == "") return;
    var commentUser = this.state.user != null && this.state.user != "" ? this.state.user : "Anonymous";
    var newComment = {text: this.state.newCommentText, id: Math.floor(Math.random() * 100) + originalId, userName: commentUser, comments: [],
      parentCommentId: this.state.comment.id, chapterId: this.state.comment.chapterId};
    var original = this.state.comment;
    original.comments.push(newComment);
    this.setState({
      comment: original,
      newCommentText: "",
      showReply: false
    });
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
      <div className="panel panel-default">
        <div className="panel-heading">{this.state.comment.userName} says:</div>
        <div className="panel-body">
            {this.state.comment.text}
          <div className="row">
            <button className="btn btn-link" onClick={this.showReply}>Reply</button>
          </div>
          <div className={this.state.showReply ? "viewer-creator" : "viewer"}>
            <NewComment comment={this.state.comment} user={this.props.user} 
            addComment={this.addComment} updateNewCommentText={this.updateNewCommentText}
            newCommentText={this.state.newCommentText}/>
          </div>
          <div className="row">
            {this.state.comment.comments.map(comment => 
              <div key={comment.id} className="col-md-12">
                <Comment comment={comment} user={this.props.user}/>
              </div>              
              )}
          </div>
        </div>
      </div>
    );
  }
}

