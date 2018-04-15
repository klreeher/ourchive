import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';


export default class Admin extends React.Component {

  matchUser()
  {
    axios.get('/api/user/email/'+this.state.banned_user_email)
        .then(function (response) {
          this.setState({user_to_ban: response.data});  

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  }

  constructor(props) {
    super(props);
    this.state = {user: props.user, notification_types: [], work_types: [], tag_types: [], banned_users: []}
  }
  componentDidMount() { 
    axios.get('/api/admin/tags/types', {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
          }})
        .then(function (response) {
          this.setState({tag_types: response.data});  

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
    axios.get('/api/admin/notifications/types', {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
          }})
        .then(function (response) {
          this.setState({notification_types: response.data});  

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
    axios.get('/api/admin/works/types', {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
          }})
        .then(function (response) {
          this.setState({work_types: response.data});  

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });

    axios.get('/api/admin/users/banned', {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
          }})
        .then(function (response) {
          this.setState({banned_users: response.data});  

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  newWorkType(evt) {
    this.setState({
      newWorkType: evt.target.value
    })
  }
  addWorkType(evt) {
    evt.target.blur()
    var oldWorkTypes = this.state.work_types;
    if (oldWorkTypes.length > 0 && oldWorkTypes[oldWorkTypes.length-1].id < 0) {
      var workId = oldWorkTypes[oldWorkTypes.length-1].id  - 1
    }
    else {
      var workId = -1
    }
    var newWorkType = {id: workId, 
        type_name: this.state.newWorkType}
    oldWorkTypes.push(newWorkType)
    this.setState({
      work_types: oldWorkTypes,
      newWorkType: ''
    })
  }
  newTagType(evt) {
    this.setState({
      newTagType: evt.target.value
    })
  }
  addTagType(evt) {
    evt.target.blur()
    var oldTagTypes = this.state.tag_types;
    if (oldTagTypes.length > 0 && oldTagTypes[oldTagTypes.length-1].id < 0) {
      var tagId = oldTagTypes[oldTagTypes.length-1].id  - 1
    }
    else {
      var TagId = -1
    }
    var newTagType = {id: tagId, 
        label: this.state.newTagType}
    oldTagTypes.push(newTagType)
    this.setState({
      tag_types: oldTagTypes,
      newTagType: ''
    })
  }
  
  render() {
    return (
      <div className="container">
        <Tabs defaultActiveKey={1} id="user-container-nav">
          <Tab eventKey={1} title="Configuration">
          <br/>
            <div>
                <div className="row">
                  <div className="col-sm-4"><strong>Notification Types</strong></div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <ul id="notification_types">
                      {this.state.notification_types.map(type => 
                          <div key={type.id}>
                            <li>
                              <div className="col-sm-2">{type.type_label}</div>
                              <div className="col-sm-2">{type.send_email}</div>
                            </li>
                          </div>
                      )}
                    </ul>
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col-sm-4"><strong>Tag Types</strong></div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <ul>
                      {this.state.tag_types.map(type => 
                          <div key={type.id}>
                            <li>
                              <div className="col-sm-2">{type.label}</div>
                            </li>
                          </div>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <input id="new_tag_type" value={this.state.newTagType} onChange={evt => this.newTagType(evt)}></input> <button className="btn btn-link" onClick={evt => this.addTagType(evt)}>Add</button>
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col-sm-4"><strong>Work Types</strong></div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <ul>
                      {this.state.work_types.map(type => 
                          <div key={type.id}>
                            <li>
                              <div className="col-sm-2">{type.type_name}</div>
                            </li>
                          </div>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <input id="new_work_type" value={this.state.newWorkType} onChange={evt => this.newWorkType(evt)}></input> <button className="btn btn-link" onClick={evt => this.addWorkType(evt)}>Add</button>
                  </div>
                </div>
            </div>
          </Tab>
          <Tab eventKey={2} title="User Administration">
          <br/>
            <div className="col-md-12">
              <div classname="row">
                <div className="col-sm-6"><h3>Banned Users</h3></div>
              </div>
              <div className="row">
                <div className="col-sm-6"><strong>Email</strong></div>
                <div className="col-sm-4"><strong>Username</strong></div>
              </div>
              <br/>
              <div className="row">
                  <ul className="chapters_ul">
                    {this.state.banned_users.map(user => 
                        <div key={user.id}>
                          <li className="chapters_ul">
                            <div className="col-sm-6">{user.email}</div>
                            <div className="col-sm-4">{user.username}</div>
                          </li>
                        </div>
                    )}
                  </ul>
                </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}