import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';
import UserContainer from './UserContainer';
import EditDeleteButtons from './EditDeleteButtons';
import {FormGroup, Checkbox, ControlLabel, HelpBlock, FormControl, Button, Radio} from 'react-bootstrap';


export default class UserForm extends React.Component {
	constructor(props) {    
	  	super(props);	  	
	    this.state = this.state = {user: {}, aboutMe: "",
            userEmail: "", userName: ""};
        this.setUserName = this.setUserName.bind(this);
        this.setUserEmail = this.setUserEmail.bind(this);
        this.setAboutMe = this.setAboutMe.bind(this);
    }

    fetchUser(userId)
    {
        axios.get('/api/user/'+userId)
          .then(function (response) {
            localStorage.setItem('profile', JSON.stringify(response.data));
            this.setState({
              user: response.data
            });  

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }

    getUser()
    {
        
        var userProfile = localStorage.getItem('profile');
        if (userProfile == null)
        {
            //todo: this means user should log in probably?
            this.fetchUser(1);
        } 
        else
        {
            this.setState({
              user: JSON.parse(userProfile)
            }); 
        }
    }

    componentWillMount() { 
        this.getUser();
    }

    setUserName(e) {
        this.setState({ userName: e.target.value });
    }

    setUserEmail(e) {
        this.setState({ userEmail: e.target.value });
    }

    setAboutMe(e) {
        this.setState({ aboutMe: e.target.value });
    }

    render() {
        return (
    	   <div className="row">
                <div className="row">
                    <form>
                        
                        <FormGroup controlId="formControlsUserName">
                          <ControlLabel>Username</ControlLabel>
                          <FormControl  type="text" 
                            value={this.state.user.userName}
                            onChange={this.setUserName}
                          />
                        </FormGroup>
                        <FormGroup controlId="formControlsUserEmail">
                          <ControlLabel>Email</ControlLabel>
                          <FormControl  type="text" 
                            value={this.state.user.userEmail}
                            onChange={this.setUserEmail}
                          />
                        </FormGroup>

                        <FormGroup controlId="formControlsUserName">
                          <ControlLabel>About Me</ControlLabel>
                          <FormControl componentClass="textarea" 
                            value={this.state.user.aboutMe}
                            onChange={this.setAboutMe}
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