import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab, Modal} from 'react-bootstrap';
import WorkStub from './WorkStub';
import UserContainer from './UserContainer';


export default class UserProfile extends React.Component {
	constructor(props) {    
	  	super(props);	  	
	    this.state = this.state = {profile_user: {}, works: [], bookmarks: [], curator: []};
      this.setMessageTitle = this.setMessageTitle.bind(this)
      this.setMessageText = this.setMessageText.bind(this)
      this.handleSendMessage = this.handleSendMessage.bind(this)
    }

    showMessageModal(event)
    {
      this.setState(
      {
        showMessageModal: true
      })
    }
    handleSendMessage(event)
    {
      event.target.blur()
      var user = {}
      user["user_id"] = 1
      axios.post('/api/message/', {
        message_subject: this.state.messageTitle,
        message_content: this.state.messageText,
        from_user: user,
        to_user: this.state.profile_user.userId, 
      })
      .then(function (response) {
        //todo add success message
        this.setState(
        {
          showMessageModal: false,
          messageTitle: "",
          messageText: ""
        })
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
      
    }

    setMessageTitle(event)
    {
      this.setState(
      {
        messageTitle: event.target.value
      })
    }
    setMessageText(event)
    {
      this.setState(
      {
        messageText: event.target.value
      })
    }

    fetchUser(userId)
  	{
	  	axios.get('/api/user/'+userId)
	      .then(function (response) {
	        this.setState({
	            profile_user: response.data,
              bookmarks: response.data.bookmarks,
              works: response.data.works
	        });  

	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
  	}

    getUser()
    {
    	this.fetchUser(this.props.match.params.userId);
    }

    getWorks(index, userId)
    {
        axios.get('/api/work/creator/'+userId)
          .then(function (response) {
            this.setState({
              works: response.data
            });  

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }
    getBookmarks(index, userId)
    {
        axios.get('/api/bookmark/curator/'+userId)
          .then(function (response) {
            var curator = {}
            if (response.data.length > 0) {
              curator = response.data[0].curator
            }
            this.setState({                
              bookmarks: response.data,
              curator: curator
            });    

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }

    componentWillMount() { 
    	this.getUser();
    	this.getWorks(0, this.props.match.params.userId);
    	this.getBookmarks(0, this.props.match.params.userId);
  	}

    render() {
    return (
      <div className="col-lg-12">
        {this.props.user != null && <div className="row">
          <button className="btn btn-link" onClick={evt => this.showMessageModal(event)}>Send Message</button>
        </div>

        }
        
        <div className="row">
          <UserContainer user={this.state.profile_user} works={this.state.works} bookmarks={this.state.bookmarks} curator={this.state.curator}/>
        </div>  
        <Modal show={this.state.showMessageModal} onHide={evt => this.handleSendMessage(evt)}>
          <Modal.Header closeButton>
            <Modal.Title>Send Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="panel panel-default">
                <div className="panel-body">
                    <div className="form-group">
                      <label htmlFor="messageTitle">Message Title</label>
                      <input id="messageTitle"
                        name="messageTitleInput" onChange={this.setMessageTitle} className="form-control"/>
                    </div>  
                    <div className="form-group">
                      <label htmlFor="messageText">Message Text</label>
                      <textarea id="messageText" rows="3"
                        name="messageText" onChange={this.setMessageText} className="form-control"></textarea>
                    </div>  
                    <div className="form-group">
                      <button onClick={evt => this.handleSendMessage(evt)} className="btn btn-default">Send Message</button>
                    </div>
                </div>
              </div>
          </div>

          </Modal.Body>
        </Modal>      
      </div>
      

    );
  }

}