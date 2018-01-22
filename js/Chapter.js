import React from 'react';
import {
  Link
} from 'react-router-dom';
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
        <div className="work_text">
          <div className="row">
            <div className="col-md-12"><h2>Chapter {this.state.chapter.number}: {this.state.chapter.title}</h2></div>
          </div>
          <div className="row">
            <div className="col-md-12"><blockquote>{this.state.chapter.chapter_summary}</blockquote></div>
          </div>
          <hr/>

          <div className="row">
            <div className="col-md-12">
              {this.state.chapter.text}
            </div>
          </div>
          <br/>
          <br/>
          <div className="row">
            <div className="col-md-12">
              <audio ref="audio_tag" src={this.state.chapter.audio_url} controls/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Image file={this.state.chapter.image_url} alt='{this.state.chapter.chapter_summary}'/>
            </div>
          </div>
          <br/>
          
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
              {this.state.chapter.comments.map(comment => 
                <div key={comment.id} className="col-md-12">
                  <Comment comment={comment} user={this.props.user} chapterId={this.state.chapter.id}/>
                </div>
                  
                )}

            </div>  
          </div>    
        </div>
      </div>
    );
  }
}

