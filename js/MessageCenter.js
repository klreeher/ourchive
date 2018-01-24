import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import Message from './Message';

export default class MessageCenter extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, messages: [], outbox: []};
		this.sendMessage = this.sendMessage.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
		this.deleteMessage = this.deleteMessage.bind(this)
		this.showInbox = this.showInbox.bind(this)
		this.markAllRead = this.markAllRead.bind(this)
		this.deleteAll = this.deleteAll.bind(this)
	}

	getMessages()
	{
		axios.get('/api/message/to/1')
	      .then(function (response) {
	        this.setState({
	          messages: response.data,
	        });  

	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
	}
	getOutbox()
	{
		axios.get('/api/message/from/1')
	      .then(function (response) {
	        this.setState({
	          outbox: response.data,
	        });  

	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
	}
	componentWillMount()
	{
		this.getMessages();
		this.getOutbox();
	}
	sendMessage(id, parentId)
	{
		console.log(id)
		console.log(parentId)
	}
	markAsRead(id, parentId)
	{
		console.log(id)
		console.log(parentId)
	}
	deleteMessage(id)
	{
		console.log(id)
		var messagesFiltered = this.state.messages.filter(function( obj ) {
		    return obj.id !== id;
		});
		this.setState(
		{
			messages: messagesFiltered
		})
	}
	markAllRead(event)
	{
		//todo the UI for this is - send mark all read - mark all read locally
		event.target.blur()
		console.log("mark all read")
		var oldMessages = this.state.messages;
		for (var i = 0; i < oldMessages.length; i++) { 
		    oldMessages[i].read = true;
		}
		this.setState(
		{
			messages: oldMessages
		})
	}
	deleteAll(event)
	{
		event.target.blur()
		if (confirm("Are you sure you want to delete ALL messages? This cannot be reversed!")) {
		    console.log("delete all");
		    this.setState({
		    	messages: []
		    })
		} else {
		    console.log("cancel delete all");
		}
	}
	showInbox(event)
	{
		
	}
	render() {
		return (
		  	<Tabs defaultActiveKey={1} id="message-center-tabs">
			    <Tab eventKey={1} title="Inbox">
			    	<br/>
			    	<button className="btn btn-link" onClick={this.markAllRead}>Mark all as read</button> | 
	                <button className="btn btn-link" onClick={this.deleteAll}>Delete all</button>
	                <br/>
	                <br/>
			    	{this.state.messages.map(message => 
		                <div key={message.id}>
		                  <Message sendMessage={this.sendMessage} deleteMessage={this.deleteMessage} 
		                  	message={message} allowReply={true} markAsRead={this.markAsRead}/>
		                </div>                  
		                )}
			    	
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