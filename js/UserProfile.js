import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab, Modal} from 'react-bootstrap';
import WorkStub from './WorkStub';
import UserContainer from './UserContainer';


export default class UserProfile extends React.Component {
	constructor(props) {
	  	super(props);
	    this.state = this.state = {profile_user: {}, works: [], bookmarks: [], curator: [], work_page: 1, bookmark_page: 1,
      work_pages: 1, bookmark_pages: 1};
      this.setMessageTitle = this.setMessageTitle.bind(this)
      this.setMessageText = this.setMessageText.bind(this)
      this.handleSendMessage = this.handleSendMessage.bind(this)
      this.getWorks = this.getWorks.bind(this);
      this.getBookmarks = this.getBookmarks.bind(this);
      this.nextPage = this.nextPage.bind(this);
      this.previousPage = this.previousPage.bind(this);
      this.getWorkPage = this.getWorkPage.bind(this);
      this.getBookmarkPage = this.getBookmarkPage.bind(this);
    }

    showMessageModal(event)
    {
      event.target.blur()
      this.setState(
      {
        showMessageModal: true
      })
    }
    handleSendMessage(event)
    {
      event.target.blur()
      axios.post('/api/message/', {
        message_subject: this.state.messageTitle,
        message_content: this.state.messageText,
        to_user: this.state.profile_user.id,
      }, {
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        'CSRF-Token': this.props.csrf
      }})
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
					console.log(response)
	        this.setState({
	            profile_user: response.data
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

    previousPage(name) {
    switch (name) {
      case "work":
        this.getWorkPage(this.state.work_page - 1)
        break
      case "bookmark":
        this.getBookmarkPage(this.state.bookmark_page - 1)
        break
    }
  }

  nextPage(name) {
    switch (name) {
      case "work":
        this.getWorkPage(this.state.work_page + 1)
        break
      case "bookmark":
        this.getBookmarkPage(this.state.bookmark_page + 1)
        break
    }
  }

  getWorkPage(page) {
    axios.get('/api/work/creator/1/'+page)
        .then(function (response) {
          this.setState({
            works: response.data.works,
            work_page: page,
            work_pages: response.data.pages
          });
        }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
  }

  getBookmarkPage(page) {
    axios.get('/api/bookmark/curator/'+this.state.curator.curator_id+'/'+page)
        .then(function (response) {
          this.setState({
            bookmarks: response.data.bookmarks,
            bookmark_page: page,
            bookmark_pages: response.data.pages
          });
        }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
  }

    getWorks(index, userId)
    {
      axios.get('/api/work/creator/'+userId)
          .then(function (response) {
            this.setState({
              works: response.data.works,
              work_pages: response.data.pages
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
            if (response.data.bookmarks.length > 0) {
              curator = response.data.bookmarks[0].curator
            }
            this.setState({
              bookmarks: response.data.bookmarks,
              curator: curator,
              bookmark_pages: response.data.pages
            });

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }

    componentDidMount() {
    	this.getUser();
      this.getWorks(0, this.props.match.params.userId);
      this.getBookmarks(0, this.props.match.params.userId)
  	}

    render() {
    return (
      <div>
        {this.props.user != null && <div className="row">
          <button className="btn btn-link" onClick={evt => this.showMessageModal(event)}>Send Message</button>
        </div>

        }

        <div className="row">
          <UserContainer user={this.state.profile_user} works={this.state.works} bookmarks={this.state.bookmarks}
          curator={this.state.curator} totalWorkPages={this.state.work_pages} totalBookmarkPages={this.state.bookmark_pages}
            currentWorkPage={this.state.work_page} currentBookmarkPage={this.state.bookmark_page}
            previousPage={this.previousPage} nextPage={this.nextPage}/>
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
