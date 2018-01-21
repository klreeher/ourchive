import Hello from './Hello';
import NavbarInternal from './NavbarInternal';
import Work from './Work';
import SingleWork from './SingleWork';
import WorkStub from './WorkStub';
import TagItem from './TagItem';
import NewWork from './NewWork';
import BookmarkList from './BookmarkList';
import React from 'react';
import ReactDOM from 'react-dom';
import BookmarkForm from './BookmarkForm';
import UserProfile from './UserProfile';
import MyProfile from './MyProfile';
import UserForm from './UserForm';
import LoginForm from './LoginForm';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';



const WorkCollection = ({ match }) => (
  <Work />
)

const Home = () => (
  <div>
    <h2>Home - Hello World</h2>
  </div>
)

const BasicExample = () => (
  <Router>
    <div>
      <NavbarInternal/>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/works" component={WorkCollection}/>
      <Route path="/work/:workId" component={SingleWork}/>
      <Route path="/bookmark/:curatorId" component={BookmarkList}/>
      <Route path="/create/work" is_edit="false" component={NewWork}/>
      <Route path="/bookmarks/new" component={BookmarkForm}/>
      <Route path="/my-profile" component={MyProfile}/>
      <Route path="/user/:userId/show" component={UserProfile}/>
      <Route path="/user/:userId/edit" component={UserForm}/>
      <Route path="/login" component={LoginForm}/>
      <Route path="/logout" component={Home}/>
    </div>
  </Router>
)
export default BasicExample

ReactDOM.render(React.createElement(BasicExample), document.getElementById('reactEntry'));

