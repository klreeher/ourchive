import React from 'react';
import axios from 'axios';
import {Link, withRouter} from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';
import UserContainer from './UserContainer';
import EditDeleteButtons from './EditDeleteButtons';
import {FormGroup, Checkbox, ControlLabel, HelpBlock, FormControl, Button, Radio} from 'react-bootstrap';


export default class UserForm extends React.Component {
	constructor(props) {    
	  	super(props);	  	
	    this.state = this.state = {user: {}, bio: "",
            email: "", username: ""};
        this.setusername = this.setusername.bind(this);
        this.setemail = this.setemail.bind(this);
        this.setbio = this.setbio.bind(this);
    }

    fetchUser(userId)
    {
        axios.get('/api/user', {   
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
          }})
          .then(function (response) {
            this.setState({
              user: response.data.user
            });  

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }

    getUser()
    {
        
      var userProfile = localStorage.getItem('jwt');
      if (userProfile == null)
      {
          this.props.history.push("/");
          return;
      } 
      else
      {
        this.fetchUser();
      }
    }

    modifyUser(evt) {
      evt.preventDefault()
      axios.put('/api/user', {
        email: this.state.user.email, 
        bio: this.state.user.bio, 
        username: this.state.user.username
      }, {   
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json'
    }}).then(function (response) {
        
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    componentWillMount() { 
        this.getUser();
    }

    setusername(e) {
        var old_user = this.state.user
        old_user.username = e.target.value
        this.setState({ username: old_user.username, user: old_user});
    }

    setemail(e) {
      var old_user = this.state.user
      old_user.email = e.target.value
        this.setState({ email: old_user.email, user: old_user });
    }

    setbio(e) {
      var old_user = this.state.user
      old_user.bio = e.target.value
      this.setState({ user: old_user, bio: old_user.bio });
    }

    render() {
        return (
    	   <div className="row">
                <div className="row">
                    <form>
                        
                        <FormGroup controlId="formControlsusername">
                          <ControlLabel>User Name</ControlLabel>
                          <FormControl  type="text" 
                            value={this.state.user.username}
                            onChange={this.setusername}
                          />
                        </FormGroup>
                        <FormGroup controlId="formControlsemail">
                          <ControlLabel>Email</ControlLabel>
                          <FormControl  type="text" 
                            value={this.state.user.email}
                            onChange={this.setemail}
                          />
                        </FormGroup>

                        <FormGroup controlId="formControlsusername">
                          <ControlLabel>About Me</ControlLabel>
                          <FormControl componentClass="textarea" 
                            value={this.state.user.bio}
                            onChange={this.setbio}
                          />
                        </FormGroup>

                        <div className="form-group">
                          <button onMouseDown={evt => this.modifyUser(evt)} className="btn btn-default">Submit</button>
                        </div>
                      </form>
                </div>
            </div>
    );
  }

}