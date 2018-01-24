import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';

export default class MessageCenter extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, message: this.props.message};
      this.sendMessage = this.sendMessage.bind(this);
    }

  sendMessage(event)
  {
    this.props.sendMessage(this.state.message.id, this.state.message.parent_id);
  }
  markAsRead(event)
  {
    
  }
  deleteMessage(event)
  {
    console.log(event)
  }
  showInbox(event)
  {
  	
  }
  render() {
    return (
      <div className="col-md-12">
		    <div className="panel panel-default">
	        <div className="panel-heading">{this.state.message.message_subject} from {this.state.message.from_user.username}</div>
	        	<div className="panel-body">
              {this.state.message.message_content}
	        	</div>
	        <div className="panel-footer">
	         <button className="btn btn-link" onClick={this.sendMessage}>Reply</button> | <button className="btn btn-link" onClick={this.deleteMessage}>Delete</button>
	        </div>
	       </div>	        	
      </div>
    );
  }

}