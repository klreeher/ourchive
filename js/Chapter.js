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
import { withAlert } from 'react-alert';

class Chapter extends React.Component {


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
  componentDidUpdate(nextProps, nextState)
  {
  }
  componentWillReceiveProps(nextProps) {
    var clean = DOMPurify.sanitize(nextProps.chapter.text);
    this.setState({chapter: nextProps.chapter, user: nextProps.user, newCommentText: "",
    toggleCommentsText: "Show Comments", cleaned_text: clean});
    document.getElementById("chapter_top").scrollIntoView();
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
    var newComment = {text: this.state.newCommentText, userName: commentUser,
      comments: [], chapterId: this.props.chapter.id};
    var apiRoute = "/api/chapter/comment/";
    axios.post(apiRoute, {
      text: this.state.newCommentText,
      chapter_id: this.props.chapter.id,
      work_id: this.props.work_id
    }, {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
      'CSRF-Token': this.props.csrf
    }})
    .then(function (response) {
        newComment.id = response.data["id"]
        var original = this.props.chapter;
        original.comments.push(newComment);
        this.setState({
          chapter: original,
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
  render() {
    return (
      <div id="chapter_top">
        <div className="text-padding">
          <div className="row">
            <div className="col-xs-9 col-md-12 "><h2>Chapter {this.props.chapter.number}: {this.props.chapter.title}</h2></div>
          </div>
          <div className="row">
            <div className="col-xs-9 col-md-12 render-linebreak"><blockquote>{this.props.chapter.summary}</blockquote></div>
          </div>
          <hr/>

          <div className="row">
            <div className="col-xs-9 col-md-12 render-linebreak" dangerouslySetInnerHTML={{ __html: this.state.cleaned_text }}>
            </div>
          </div>
          <br/>
          <br/>
          {this.props.chapter.audio_url && this.props.chapter.audio_url != "" ?
            <div className="row">
              <div className="col-xs-9 col-md-12">
                <audio ref="audio_tag" src={this.props.chapter.audio_url} controls/>
              </div>
            </div>
          : <div></div>}

          <div className="row">
            <div className="col-xs-9 col-md-12">
              {this.props.chapter.image_url && <img src={this.props.chapter.image_url} alt='{this.props.chapter.image_alt_text}' class="img-fluid"/>}
            </div>
          </div>
          <br/>
          {this.props.comments_permitted &&
            <div>

              {this.props.anon_comments_permitted || this.props.user != undefined ?
                <div>
                  <div className="row">
                    <div className="col-xs-6">
                        Leave a comment:
                    </div>
                  </div>
                  <div className="row">
                        <NewComment comment={null} user={this.props.user}
                    addComment={this.addComment} updateNewCommentText={this.updateNewCommentText}
                    newCommentText={this.state.newCommentText}/>
                  </div>

                  <br/>
              </div> : <div></div> }

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
                    {this.props.chapter.comments.map(comment =>
                      <div key={comment.id} className="col-md-12" ref={"comment_"+comment.id}>
                        <Comment comment={comment} user={this.props.user} chapterId={this.props.chapter.id} csrf={this.props.csrf}
                        anon_comments_permitted={this.props.anon_comments_permitted}/>
                      </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withAlert(Chapter)
