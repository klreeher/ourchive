import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import Message from './Message';

export default class MessageCenter extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, messages: []};
		this.sendMessage = this.sendMessage.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
		this.deleteMessage = this.deleteMessage.bind(this)
		this.showInbox = this.showInbox.bind(this)
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
	componentWillMount()
	{
		this.getMessages();
	}
	sendMessage(id, type)
	{
		console.log(id)
		console.log(type)
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
	  	<Tabs defaultActiveKey={1} id="message-center-tabs">
	    <Tab eventKey={1} title="Inbox">
	    	<br/>
	    	{this.state.messages.map(message => 
                <div key={message.id}>
                  <Message sendMessage={this.sendMessage} message={message}/>
                </div>                  
                )}
	    	
		</Tab>
		<Tab eventKey={2} title="Sent">
			<div className="col-md-12">
				i am outbox content
	    	</div>
	    </Tab>
	    <Tab eventKey={3} title="Archive">
			<div className="col-md-12">
				i am archived content
	    	</div>
	    </Tab>
		  </Tabs>
	);
	}

}