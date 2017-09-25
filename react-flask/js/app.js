import Hello from './Hello';
import Work from './Work';
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

const SingleWork = ({ match }) => (
  <div>
    <h3>{match.params.workId}</h3>
  </div>
)

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/works">Works</Link></li>
        <li><Link to="/works/13">Works</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/works" component={WorkCollection}/>
      <Route path="/works/:workId" component={SingleWork}/>
    </div>
  </Router>
)
export default BasicExample

ReactDOM.render(React.createElement(BasicExample), document.getElementById('reactEntry'));

