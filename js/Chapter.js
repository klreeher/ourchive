import React from 'react';
import axios from 'axios';
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
    var clean = DOMPurify.sanitize(props.chapter.text);
    this.state = {chapter: props.chapter, user: props.user, newCommentText: "",
    toggleCommentsText: "Show Comments", cleaned_text: clean};
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
    event.preventDefault()
    if (this.state.newCommentText == null || this.state.newCommentText == "") return;
    var commentUser = this.state.user != null && this.state.user != "" ? this.state.user : "Anonymous";
    var newComment = {text: this.state.newCommentText, userName: commentUser, 
      comments: [], chapterId: this.state.chapter.id};
    var apiRoute = "/api/chapter/comment/";
    axios.post(apiRoute, {
      text: this.state.newCommentText, 
      user_id: 1, 
      chapter_id: this.state.chapter.id
    })
    .then(function (response) {
        newComment.id = response.data["id"]
        var original = this.state.chapter;
        original.comments.push(newComment);
        this.setState({
          chapter: original,
          newCommentText: ""
        });
    }.bind(this))
    .catch(function (error) {
      console.log(error);
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
            <div className="col-xs-9 col-md-12 render-linebreak"><blockquote>{this.state.chapter.summary}</blockquote></div>
          </div>
          <hr/>

          <div className="row">
            <div className="col-xs-9 col-md-12 render-linebreak" dangerouslySetInnerHTML={{ __html: this.state.cleaned_text }}>
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
              <Image file={this.state.chapter.image_url} alt='{this.state.chapter.summary}'/>
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

