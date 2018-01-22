import React from 'react';
import {
  Link
} from 'react-router-dom';
import Image from 'react-image';
import ReactPlayer from 'react-player';
import Comment from './Comment';

export default class Chapter extends React.Component {


  constructor(props) {
    super(props);
    this.state = {chapter: props.chapter, user: props.user, newCommentText: ""};
    this.addComment = this.addComment.bind(this)
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
  addComment(event)
  {
    if (this.state.newCommentText == null || this.state.newCommentText == "") return;
    var commentUser = this.state.user != null && this.state.user != "" ? this.state.user : "Anonymous";
    var newComment = {text: this.state.newCommentText, id: Math.random(), userName: commentUser};
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
          <div className="row">
            <div className="col-md-12">
              <textarea id="new_comment" value={this.state.newCommentText} rows="3"
                  onChange={this.updateNewCommentText} className="form-control"></textarea>
              
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-md-12">
              <button onClick={this.addComment}>Add Comment</button>
            </div>
          </div>  
          <br/>
          <div className="row">
            <div className="col-md-12">
              <h3>Comments</h3>
            </div>
          </div>   
          <div className="row">
            {this.state.chapter.comments.map(comment => 
              <div key={comment.id} className="col-md-12">
                <Comment comment={comment}/>
              </div>
                
              )}

          </div>      
        </div>
      </div>
    );
  }
}

