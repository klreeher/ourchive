import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import NewComment from './NewComment';

export default class MessageCenter extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, message: this.props.message};
      this.sendMessage = this.sendMessage.bind(this);
      this.deleteMessage = this.deleteMessage.bind(this);
      this.markAsRead = this.markAsRead.bind(this);
      this.updateNewMessageText = this.updateNewMessageText.bind(this);
      this.showReply = this.showReply.bind(this);
    }

  sendMessage(event)
  {
    event.target.blur()
    this.props.sendMessage(this.state.message.id, this.state.newMessageText);
    var oldMessage = this.state.message;
    oldMessage.read = true;
    this.setState(
    {
      showReply: false,
      newMessageText: "",
      message: oldMessage
    }) 
    
  }
  showReply(event)
  {
    this.setState(
    {
      showReply: true
    })     
  }
  markAsRead(event)
  {
    event.target.blur()
    var oldMessage = this.state.message;
    oldMessage.read = true;
    this.setState(
    {
      message: oldMessage
    })
    this.props.markAsRead(this.state.message.id, this.state.message.parent_id);
  }
  deleteMessage(event)
  {
    event.target.blur()
    this.props.deleteMessage(this.state.message.id);
  }
  updateNewMessageText(event)
  {
    this.setState(
    {
      newMessageText: event.target.value
    })
  }
  render() {
    return (
      <div className="col-md-12">
		    <div className="panel panel-default">
	        <div className="panel-heading">
              {!this.state.message.read ?
                <b> {this.state.message.message_subject} from {this.state.message.from_user.username}</b>
                : <div>{this.state.message.message_subject} from {this.state.message.from_user.username}</div>
              }
              
              
          </div>
	        	<div className="panel-body">
              {this.state.message.message_content}
	        	</div>
          {this.props.allowReply &&              
              <div className="panel-footer">
                <button className="btn btn-link" onClick={this.showReply}>Reply</button> | 
                <button className="btn btn-link" onClick={this.deleteMessage}>Delete</button> | 
                <button className="btn btn-link" onClick={this.markAsRead}>Mark read</button>                
                <div className={this.state.showReply ? "viewer-creator" : "viewer"}>
                  <br/>
                  <NewComment comment={null} user={this.props.user} 
                  addComment={this.sendMessage} updateNewCommentText={this.updateNewMessageText}
                  newCommentText={this.state.newMessageText}/>
                </div>
              </div>
          }
	        
	       </div>	        	
      </div>
    );
  }

}