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
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  
  render() {
    return (
      <div className="container">
        <Tabs defaultActiveKey={1} id="user-container-nav">
          <Tab eventKey={1} title="Configuration">
          <br/>
            <div>
                <div className="row">
                  <div className="col-sm-4">
                      <input type="checkbox" id="allowTagCreation" onChange={evt => this.updateConfiguration(evt, 1)}/>  Allow tag configuration
                    </div>
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
                <div className="row">
                  <div className="col-sm-4">
                    <input id="new_notification_type" value={this.state.newNotificationType} onChange={evt => this.newNotificationType(evt)}></input> <button className="btn btn-link" onClick={evt => this.addNotificationType}>Add</button>
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
                    <input id="new_tag_type" value={this.state.newTagType} onChange={evt => this.newTagType(evt)}></input> <button className="btn btn-link" onClick={evt => this.addTagType}>Add</button>
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
                              <div className="col-sm-2">{type.type_label}</div>
                              <div className="col-sm-2">{type.type_name}</div>
                            </li>
                          </div>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <input id="new_work_type" value={this.state.newWorkType} onChange={evt => this.newWorkType(evt)}></input> <button className="btn btn-link" onClick={evt => this.addWorkType}>Add</button>
                  </div>
                </div>
            </div>
          </Tab>
          <Tab eventKey={2} title="User Administration">
            <div className="col-md-12">
              
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}