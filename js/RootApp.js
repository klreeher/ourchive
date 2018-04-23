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

            <Route exact path="/" component={(props, state, params) => <Home user={user} {...props}/>}/>
            <Route path="/works" component={Work}/>
            <Route path="/admin" component={(props, state, params) => <Admin user={user} {...props}/>}/>
            <Route path="/work/:workId" component={(props, state, params) => <SingleWork user={user} {...props}/>}/>
            <Route exact path="/user/:curatorId/bookmarks" component={(props, state, params) => <BookmarkList user={user} {...props}/>}/>
            <Route path="/bookmark/:bookmarkId" component={(props, state, params) => <BookmarkItem user={user} {...props}/>}/>
            <Route path="/create/work" is_edit="false" component={(props, state, params) => <NewWork user={user} {...props}/>}/>
            <Route path="/bookmarks/new" component={(props, state, params) => <BookmarkForm user={user} {...props}/>}/>
            <Route path="/my-profile" component={MyProfile}/>
            <Route path="/user/:userId/show" component={(props, state, params) => <UserProfile user={user} {...props}/>}/>
            <Route path="/user/:userId/edit" component={UserForm}/>
            <Route path="/user/:userId/messages" component={(props, state, params) => <MessageCenter user={user} {...props}/>}/>
            <Route path="/notifications" component={(props, state, params) => <Notifications user={user} {...props}/>}/>
            <Route path="/tag/:tagId/:tagText" component={(props, state, params) => <TagResults user={user} {...props}/>}/>
          </div>
        </Router>
    );
  }
}

