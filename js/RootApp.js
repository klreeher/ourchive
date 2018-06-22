import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import NavbarInternal from './NavbarInternal';
import Work from './Work';
import SingleWork from './SingleWork';
import WorkStub from './WorkStub';
import TagItem from './TagItem';
import NewWork from './NewWork';
import BookmarkList from './BookmarkList';

import BookmarkForm from './BookmarkForm';
import BookmarkItem from './BookmarkItem';
import UserProfile from './UserProfile';
import MyProfile from './MyProfile';
import UserForm from './UserForm';
import Home from './Home';
import MessageCenter from './MessageCenter';
import Notifications from './Notifications';
import TagResults from './TagResults';
import Admin from './Admin';


export default class RootApp extends React.Component {



  constructor(props) {
    super(props);
    var user = localStorage.getItem('jwt');
    this.state = {user: user};
    this.updateUser = this.updateUser.bind(this);
    this.updateCsrf = this.updateCsrf.bind(this);
  }
  componentWillMount() {     
    
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  updateUser(csrf)
  {
    var user = localStorage.getItem('jwt');
    console.log(csrf)
    this.setState(
    {
      user: user,
      csrf_token: csrf
    })
  }

  updateCsrf(csrf)
  {
    this.setState(
    {
      csrf_token: csrf
    })
  }

  render() {
    const user = this.state.user;
    const csrf = this.state.csrf_token;
    return (
        <Router>

          <div>
            <NavbarInternal updateUser={this.updateUser} updateCsrf = {this.updateCsrf}/>

            <hr/>

            <Route exact path="/" component={(props, state, params) => <Home user={user} csrf={csrf} {...props}/>}/>
            <Route path="/works" component={Work}/>
            <Route path="/admin" component={(props, state, params) => <Admin user={user} csrf={csrf} {...props}/>}/>
            <Route path="/work/:workId" component={(props, state, params) => <SingleWork user={user} csrf={csrf} {...props}/>}/>
            <Route exact path="/user/:curatorId/bookmarks" component={(props, state, params) => <BookmarkList user={user} csrf={csrf} {...props}/>}/>
            <Route path="/bookmark/:bookmarkId" component={(props, state, params) => <BookmarkItem user={user} csrf={csrf} {...props}/>}/>
            <Route path="/create/work" is_edit="false" component={(props, state, params) => <NewWork user={user} csrf={csrf} {...props}/>}/>
            <Route path="/bookmarks/new" component={(props, state, params) => <BookmarkForm user={user} csrf={csrf} {...props}/>}/>
            <Route path="/my-profile" component={MyProfile}/>
            <Route path="/user/:userId/show" component={(props, state, params) => <UserProfile user={user} csrf={csrf} {...props}/>}/>
            <Route path="/user/:userId/edit" component={UserForm}/>
            <Route path="/user/messages" component={(props, state, params) => <MessageCenter user={user} csrf={csrf} {...props}/>}/>
            <Route path="/notifications" component={(props, state, params) => <Notifications user={user} csrf={csrf} {...props}/>}/>
            <Route path="/tag/:tagId/:tagText" component={(props, state, params) => <TagResults user={user} csrf={csrf} {...props}/>}/>
          </div>
        </Router>
    );
  }
}

