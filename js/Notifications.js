import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab, DropdownButton, MenuItem} from 'react-bootstrap';
import Notification from './Notification';

export default class Notifications extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, notifications: []};
      this.goToItem = this.goToItem.bind(this);
      this.getNotifications = this.getNotifications.bind(this);
    }

  componentWillMount()
  {
    this.getNotifications();
  }
  getNotifications()
  {
    var notificationsJson = [
      {
        "type": "Comment",
        "content": "New comment on [title] from [user]: blah blah blah blah blah blah...",
        "dateCreated": "2018-01-18",
        "id": 123
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
      notifications: notificationsJson
    })
  }
  goToItem(event)
  {
    event.target.blur()
    
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
              <MenuItem eventKey="1">Comment</MenuItem>
              <MenuItem eventKey="2">System Notification</MenuItem>
              <MenuItem eventKey="2">All</MenuItem>              
            </DropdownButton>            
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
                    <Notification notification={notification} user={this.props.user} key={notification.id}/>
                    
            )}
          </tbody>          
        </table>  
        </div>      
      </div>
    );
  }

}