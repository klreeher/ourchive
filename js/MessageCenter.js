import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import Message from './Message';
import NewComment from './NewComment';
import EditDeleteButtons from './EditDeleteButtons';
import { withAlert } from 'react-alert';

class MessageCenter extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, messages: [], outbox: [], user_id: props.match.params.userId};
		this.sendMessage = this.sendMessage.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
		this.deleteMessage = this.deleteMessage.bind(this)
		this.showInbox = this.showInbox.bind(this)
		this.markAllRead = this.markAllRead.bind(this)
		this.deleteAll = this.deleteAll.bind(this)
		this.showNewMessage = this.showNewMessage.bind(this)
		this.updateNewMessageText = this.updateNewMessageText.bind(this)
	}

	getMessages()
	{
		axios.get('/api/user/messages/inbox', {   
        	headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        	'CSRF-Token': this.props.csrf
      		}})
	      .then(function (response) {
	      	if (response.data.length > 0)
	      	{
	      		this.setState({
		          messages: response.data,
		        });  
	      	}
	        

	      }.bind(this))
	      .catch(function (error) {
	        this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
	    }.bind(this));
	}
	getOutbox()
	{
		axios.get('/api/user/messages/outbox',  {   
        	headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        	'CSRF-Token': this.props.csrf
      		}})
	      .then(function (response) {
	        this.setState({
	          outbox: response.data,
	        });  

	      }.bind(this))
	      .catch(function (error) {
	        this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
	    }.bind(this));
	}
	componentDidMount()
	{
		this.getMessages();
		this.getOutbox();
	}
	sendMessage(parent_id, new_message_text, parent_message_to_id, parent_message_subject)
	{
	  this.setState(
	  {
	    showNewMessage: false
	  })
      axios.post('/api/message/', {
        message_subject: parent_message_subject,
        message_content: new_message_text,
        to_user: parent_message_to_id, 
        parent_id: parent_id
      }, {   
        	headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        	'CSRF-Token': this.props.csrf
      		}})
      .then(function (response) {
        this.getMessages()
        this.setState(
	    {
	      newMessageText: ""
	    })
      }.bind(this))
      .catch(function (error) {
        this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
      }.bind(this));
	    
	}
	updateNewMessageText(event)
	{
	    this.setState(
	    {
	      newMessageText: event.target.value
	    })
	}
	showNewMessage(evt){
		evt.target.blur()
		this.setState({
			showNewMessage: true
		})
	}
	markAsRead(id, parentId)
	{
		axios.post('/api/message/'+id+'/read', {"empty":"empty"}, {   
        	headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        	'CSRF-Token': this.props.csrf
      		}})
	      .then(function (response) {
	      }.bind(this))
	      .catch(function (error) {
	        this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
	            timeout: 6000,
	            type: 'error'
	          })
	      }.bind(this));
	}
	deleteMessage(id)
	{
		axios.delete('/api/message/'+id, {   
        	headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        	'CSRF-Token': this.props.csrf
      		}})
	      .then(function (response) {
	      	var messagesFiltered = this.state.messages.filter(function( obj ) {
		    	return obj.id !== id;
			});
			this.setState(
			{
				messages: messagesFiltered
			})
	      }.bind(this))
	      .catch(function (error) {
	        this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
	            timeout: 6000,
	            type: 'error'
	          })
	      }.bind(this));
		

	}
	markAllRead(event)
	{
		//todo the UI for this is - send mark all read - mark all read locally
		event.target.blur()
		axios.post('/api/user/messages/read', {}, {   
        	headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        	'CSRF-Token': this.props.csrf
      		}})
		      .then(function (response) {
		        var oldMessages = this.state.messages;
				for (var i = 0; i < oldMessages.length; i++) { 
				    oldMessages[i].read = true;
				}
				this.setState(
				{
					messages: oldMessages
				})
		      }.bind(this))
		      .catch(function (error) {
		        this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
		            timeout: 6000,
		            type: 'error'
		          })
		      }.bind(this));
		
	}
	deleteAll(event)
	{
		event.target.blur()
		if (confirm("Are you sure you want to delete ALL messages? This cannot be reversed!")) {
		    axios.delete('/api/user/messages/delete', {   
        	headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        	'CSRF-Token': this.props.csrf
      		}})
		      .then(function (response) {
		        //todo add success message
		        this.setState(
		        {
		          messages: []
		        })
		      }.bind(this))
		      .catch(function (error) {
		        this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
		            timeout: 6000,
		            type: 'error'
		          })
		      }.bind(this));
		}
	}
	showInbox(event)
	{
		
	}
	render() {
	  const actions = []
      var action = {}
      action.actionToDo = this.markAllRead;
      action.actionText="Mark All Read";
      actions.push(action)
      var deleteAction = {}
      deleteAction.actionToDo = this.deleteAll;
      deleteAction.actionText="Delete All";
      actions.push(deleteAction)
	  return (
	  	<Tabs defaultActiveKey={1} id="message-center-tabs">
		    <Tab eventKey={1} title="Inbox">
		    	<div className="row">
			      <div className="col-xs-10">
			  		  {this.state.messages.map(message => 
		                <div key={message.id}>
		                  <Message sendMessage={this.sendMessage} deleteMessage={this.deleteMessage} 
		                  	message={message} allowReply={true} markAsRead={this.markAsRead}/>
		                </div>                  
		                )}
			  	  </div>
			      <div className="col-xs-2">
			        <EditDeleteButtons dropdownLabel="Inbox Actions" actions={actions}/>
			      </div>
			    </div>		    	
			</Tab>
			<Tab eventKey={2} title="Sent">
				<br/>
				{this.state.outbox.map(message => 
	            <div key={message.id}>
	              <Message sendMessage={this.sendMessage} deleteMessage={this.deleteMessage} 
	              	message={message} allowReply={false}/>
	            </div>                  
	            )}
		    </Tab>
	    
		</Tabs>
	  );
}
}

export default withAlert(MessageCenter)