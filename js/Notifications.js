import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab, DropdownButton, MenuItem} from 'react-bootstrap';
import Notification from './Notification';
import { withAlert } from 'react-alert';

class Notifications extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, notifications: []};
      this.getNotifications = this.getNotifications.bind(this);
      this.filter = this.filter.bind(this);
      this.deleteNotification = this.deleteNotification.bind(this);
    }

  componentDidMount()
  {
    this.getNotifications();
  }

  deleteNotification(notification)
  {
    axios.delete('/api/notifications/'+ notification.id, {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
          'CSRF-Token': this.props.csrf
          }})
        .then(function (response) {
          var notificationsFiltered = this.state.notifications.filter(function( obj ) {
              return obj.id !== notification.id;
          });
          this.setState(
          {
            notifications: notificationsFiltered
          })

        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
      }.bind(this));
    
  }

  deleteAll(evt)
  {
    evt.target.blur();
    if (confirm("Are you sure you want to delete ALL notifications? This cannot be reversed!")) {
        axios.delete('/api/notifications', {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
          'CSRF-Token': this.props.csrf
          }})
        .then(function (response) {
            this.setState({
            notifications: []
          })

        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
      }.bind(this));
        
    } else {
        console.log("cancel delete all");
    }
  }

  getNotifications()
  {
    axios.get('/api/notifications', {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
          'CSRF-Token': this.props.csrf
          }})
        .then(function (response) {
          this.setState({
            notifications: response.data,
            notificationsOriginal: response.data
          })

        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
      }.bind(this));
  }
  filterOnComments(evt)
  {
    var works = this.filter("Work")
    var bookmarks = this.filter("Bookmark")
    this.setState({
      notifications: works.concat(bookmarks)
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
      <div>
      {this.state.notifications && 
        <div>
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
      }
           
      </div>
    );
  }
}

export default withAlert(Notifications)