import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Hello from './Hello';
import NavbarInternal from './NavbarInternal';
import Work from './Work';
import SingleWork from './SingleWork';
import WorkStub from './WorkStub';
import TagItem from './TagItem';
import NewWork from './NewWork';
import BookmarkList from './BookmarkList';

import BookmarkForm from './BookmarkForm';
import UserProfile from './UserProfile';
import MyProfile from './MyProfile';
import UserForm from './UserForm';
import Home from './Home';
import MessageCenter from './MessageCenter';
import Notifications from './Notifications';

export default class RootApp extends React.Component {



  constructor(props) {
    super(props);
    var user = localStorage.getItem('jwt');
    this.state = {user: user};
    this.updateUser = this.updateUser.bind(this);
  }
  componentWillMount() {     
    
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  updateUser()
  {
    var user = localStorage.getItem('jwt');
    this.setState(
    {
      user: user
    })
  }

  render() {
    const user = this.state.user;
    return (
      <Router>
        <div>
          <NavbarInternal updateUser={this.updateUser}/>

          <hr/>

          <Route exact path="/" component={Home}/>
          <Route path="/works" component={Work}/>
          <Route path="/work/:workId" component={(props, state, params) => <SingleWork user={user} {...props}/>}/>
          <Route path="/work/:workId/chapter/:chapterId/comment/:commentId" component={(props, state, params) => <SingleWork user={user} {...props}/>}/>
          <Route path="/bookmark/:curatorId" component={(props, state, params) => <BookmarkList user={user} {...props}/>}/>
          <Route path="/create/work" is_edit="false" component={NewWork}/>
          <Route path="/bookmarks/new" component={BookmarkForm}/>
          <Route path="/my-profile" component={MyProfile}/>
          <Route path="/user/:userId/show" component={(props, state, params) => <UserProfile user={user} {...props}/>}/>
          <Route path="/user/:userId/edit" component={UserForm}/>
          <Route path="/messages" component={MessageCenter}/>
          <Route path="/notifications" component={(props, state, params) => <Notifications user={user} {...props}/>}/>
        </div>
      </Router>
    );
  }
}

