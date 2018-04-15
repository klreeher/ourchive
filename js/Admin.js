import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import {Tabs, Tab, Row, Nav, Col, NavItem} from 'react-bootstrap';


export default class Admin extends React.Component {

  addBannedUser(evt)
  {
    evt.target.blur()
    axios.get('/api/user/username/'+this.state.newBannedUser)
        .then(function (response) {
          var oldBannedUsers = this.state.banned_users
          oldBannedUsers.push(response.data)
          this.setState({banned_users: oldBannedUsers, newBannedUser: ''});
          axios.post('/api/admin/users/'+response.data['id']+'/banned', {
          empty: 'empty'
          }, {   
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
          }})
          .then(function (response) {
              
          }.bind(this))
          .catch(function (error) {
            console.log(error);
          })
          
        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  }

  unBanUser(evt, userId)
  {
    evt.target.blur()
    var oldBannedUsers = this.state.banned_users
    oldBannedUsers = oldBannedUsers.filter(function(user) {
        return user.id !== userId;
    });
    this.setState({banned_users: oldBannedUsers, newBannedUser: ''});
    axios.delete('/api/admin/users/'+userId+'/banned', {   
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
      }})
      .then(function (response) {
          
      }.bind(this))
      .catch(function (error) {
        console.log(error);
    })
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

  newBannedUser(evt) {
    this.setState({
      newBannedUser: evt.target.value
    })
  }

  newWorkType(evt) {
    this.setState({
      newWorkType: evt.target.value
    })
  }
  addWorkType(evt) {
    evt.target.blur()
    var newWorkType = {id: -1, 
        type_name: this.state.newWorkType}
    axios.post('/api/admin/works/types', {
      'types': newWorkType
      },
      {   
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
      }})
      .then(function (response) {
          var oldWorkTypes = this.state.work_types;
          oldWorkTypes.id = response.data['type_id']
          oldWorkTypes.push(newWorkType)
          this.setState({
            work_types: oldWorkTypes,
            newWorkType: ''
          })
      }.bind(this))
      .catch(function (error) {
        console.log(error);
    })
    
  }
  newTagType(evt) {
    this.setState({
      newTagType: evt.target.value
    })
  }
  addTagType(evt) {
    evt.target.blur()
    var newTagType = {id: -1, 
        label: this.state.newTagType}
    axios.post('/api/admin/tags/types', {
      'types': newTagType
      },
      {   
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
      }})
      .then(function (response) {
          var oldTagTypes = this.state.tag_types;
          oldTagTypes.id = response.data['type_id']
          oldTagTypes.push(newTagType)
          this.setState({
            tag_types: oldTagTypes,
            newTagType: ''
          })
      }.bind(this))
      .catch(function (error) {
        console.log(error);
    })
  }
  
  render() {
    return (
      <Tab.Container id="left-tabs" defaultActiveKey="first" className="container">
          <Row className="clearfix">
            <Col sm={2}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="first">System</NavItem>
                <NavItem eventKey="second">Users</NavItem>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content animation>
                <Tab.Pane eventKey="first">
                  <div className="row">
                    <div className="col-sm-6"><h3>System Types</h3></div>
                  </div>
                  <br/>
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
                    <div className="col-sm-6">
                      <input id="new_tag_type" value={this.state.newTagType} onChange={evt => this.newTagType(evt)}></input> <button className="btn btn-link" onClick={evt => this.addTagType(evt)}>Add</button>
                    </div>
                  </div>
                  <br/>
                  <div className="row">
                    <div className="col-sm-4"><strong>Work Types</strong></div>
                  </div>
                  <div className="row">
                    <div className="col-sm-8">
                      <ul>
                        {this.state.work_types.map(type => 
                            <div key={type.id}>
                              <li>
                                <div className="col-sm-4">{type.type_name}</div>
                              </li>
                            </div>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <input id="new_work_type" value={this.state.newWorkType} onChange={evt => this.newWorkType(evt)}></input> <button className="btn btn-link" onClick={evt => this.addWorkType(evt)}>Add</button>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <div className="row">
                    <div className="col-sm-6"><h3>Banned Users</h3></div>
                  </div>
                  <br/>
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
                                <div className="col-sm-5">{user.email}</div>
                                <div className="col-sm-5">{user.username}</div>
                                <div className="col-sm-2">
                                  <button className="btn btn-link" onClick={evt => this.unBanUser(evt, user.id)}>Unban</button>
                                </div>
                              </li>
                            </div>
                        )}
                      </ul>
                  </div>
                  <br/>
                  <br/>
                  <div className="row">
                    <div className="col-sm-8">
                      <input id="new_banned_user" value={this.state.newBannedUser} onChange={evt => this.newBannedUser(evt)} placeholder="Enter a username to ban..."></input> <button className="btn btn-danger" onClick={evt => this.addBannedUser(evt)}>Ban</button>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
    );
  }
}