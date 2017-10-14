import Hello from './Hello';
import NavbarInternal from './NavbarInternal';
import Work from './Work';
import SingleWork from './SingleWork';
import React from 'react';
import ReactDOM from 'react-dom';
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
    <h2>Home</h2>
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
    </div>
  </Router>
)
export default BasicExample

ReactDOM.render(React.createElement(BasicExample), document.getElementById('reactEntry'));

