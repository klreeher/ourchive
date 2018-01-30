import React from 'react';
import {
  Link
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Image from 'react-image';
import ReactPlayer from 'react-player';
import Comment from './Comment';
import NewComment from './NewComment';

export default class Chapter extends React.Component {


  constructor(props) {
    super(props);
    this.state = {chapter: props.chapter, user: props.user, newCommentText: "",
    toggleCommentsText: "Show Comments"};
    this.addComment = this.addComment.bind(this)
    this.toggleComments = this.toggleComments.bind(this)
    this.updateNewCommentText = this.updateNewCommentText.bind(this)
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ chapter: nextProps.chapter });
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
    var commentUser = this.state.user != null && this.state.user != "" ? this.state.user : "Anonymous";
    var newComment = {text: this.state.newCommentText, id: Math.floor(Math.random() * 100) + this.state.chapter.id, userName: commentUser, comments: [],
      parentId: null, chapterId: this.state.chapter.id};
    var original = this.state.chapter;
    original.comments.push(newComment);
    this.setState({
      chapter: original,
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
        <div className="text-padding">
          <div className="row">
            <div className="col-xs-9 col-md-12 "><h2>Chapter {this.state.chapter.number}: {this.state.chapter.title}</h2></div>
          </div>
          <div className="row">
            <div className="col-xs-9 col-md-12"><blockquote>{this.state.chapter.chapter_summary}</blockquote></div>
          </div>
          <hr/>

          <div className="row">
            <div className="col-xs-9 col-md-12">
              {this.state.chapter.text}
            </div>
          </div>
          <br/>
          <br/>
          <div className="row">
            <div className="col-xs-9 col-md-12">
              <audio ref="audio_tag" src={this.state.chapter.audio_url} controls/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-9 col-md-12">
              <Image file={this.state.chapter.image_url} alt='{this.state.chapter.chapter_summary}'/>
            </div>
          </div>
          <br/>
          
          <div className="row">
            <div className="col-xs-3">
                Leave a comment:
            </div>
          </div>  
          <div className="row">
                <NewComment comment={null} user={this.props.user} 
            addComment={this.addComment} updateNewCommentText={this.updateNewCommentText}
            newCommentText={this.state.newCommentText}/>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-9 col-md-12">
              <button className="btn btn-link btn-lg" onClick={this.toggleComments}>{this.state.toggleCommentsText}</button>
            </div>
          </div>
          <div className={this.state.showComments ? "viewer-creator" : "viewer"}>
            <div className="row">
              <div className="col-xs-4 col-md-12">
                <h3>Comments</h3>
              </div>
            </div>   
            <div className="row">
              <div className="col-xs-9 col-md-12">
                {this.state.chapter.comments.map(comment => 
                  <div key={comment.id} className="col-md-12" ref={"comment_"+comment.id}>
                    <Comment comment={comment} user={this.props.user} chapterId={this.state.chapter.id}/>
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

