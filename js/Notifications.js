import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab, DropdownButton, MenuItem} from 'react-bootstrap';
import Notification from './Notification';

export default class Notifications extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, notifications: []};
      this.getNotifications = this.getNotifications.bind(this);
      this.filter = this.filter.bind(this);
      this.deleteNotification = this.deleteNotification.bind(this);
    }

  componentWillMount()
  {
    this.getNotifications();
  }

  deleteNotification(notification)
  {
    console.log(notification.id)
    var notificationsFiltered = this.state.notifications.filter(function( obj ) {
        return obj.id !== notification.id;
    });
    this.setState(
    {
      notifications: notificationsFiltered
    })
  }

  deleteAll(evt)
  {
    evt.target.blur();
    if (confirm("Are you sure you want to delete ALL notifications? This cannot be reversed!")) {
        console.log("delete all");
        this.setState({
          notifications: []
        })
    } else {
        console.log("cancel delete all");
    }
  }

  getNotifications()
  {
    var notificationsJson = [
      {
        "type": "Work",
        "content": "New comment on [title] from [user]: blah blah blah blah blah blah...",
        "dateCreated": "2018-01-18",
        "id": 123,
        "workId": 1,
        "chapterId": 2,
        "commentId": 257
      },
      {
        "type": "Bookmark",
        "content": "New comment on [bookmark title] from [user]: blah blah blah blah blah blah...",
        "dateCreated": "2018-01-18",
        "id": 125,
        "bookmarkId": 5,
        "commentId": 296
      },
      {
        "type": "System Notification",
        "content": "An update to your favorite collection [name] has occurred!",
        "dateCreated": "2018-01-20",
        "id": 124
      }
    ]
    this.setState(
    {
      notifications: notificationsJson,
      notificationsOriginal: notificationsJson
    })
  }
  filterOnComments(evt)
  {
    var transform = this.filter("Comment")
    this.setState({
      notifications: transform
    })
  }
  filterOnSystemNotification(evt)
  {
    var transform = this.filter("System Notification")
    this.setState({
      notifications: transform
    })
  }
  filterOnAll(evt)
  {
    this.setState({
      notifications: this.state.notificationsOriginal
    })
  }

  filter(termToMatch)
  {
    var transform = []
    for (var i = 0; i < this.state.notificationsOriginal.length; i++)
    {
      if (this.state.notificationsOriginal[i].type === termToMatch)
      {
        transform.push(this.state.notificationsOriginal[i]);
      }
    }
    return transform
  }
  render() {
    return (
      <div className="container-fluid text-padding">
        <div className="row">
          <div className="col-xs-3">

            <DropdownButton
              bsStyle="default"
              title="Filter notifications by..."
              key={1}
              id={`dropdown-basic-${1}`}
              >
              <MenuItem eventKey="1" onSelect={evt => this.filterOnComments(evt)}>Comment</MenuItem>
              <MenuItem eventKey="2" onSelect={evt => this.filterOnSystemNotification(evt)}>System Notification</MenuItem>
              <MenuItem eventKey="2" onSelect={evt => this.filterOnAll(evt)}>All</MenuItem>              
            </DropdownButton>            
          </div>
          <div className="col-xs-1">
            <button className="btn btn-link" onClick={evt => this.deleteAll(evt)}>Delete All</button>
          </div>
        </div>
        <br/>
        <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th key="Content">Content</th>
              <th key="Time">Time</th> 
            </tr>
          </thead>
          <tbody>
            {this.state.notifications.map(notification => 
                    <Notification notification={notification} user={this.props.user} key={notification.id} deleteNotification={this.deleteNotification}/>
                    
            )}
          </tbody>          
        </table>  
        </div>      
      </div>
    );
  }

}