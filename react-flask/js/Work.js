import React from 'react';
import {
  Link
} from 'react-router-dom';

var json = {
	"employees": 
	[
	{
	"key": "1",
  "name": "barb",
  "url": "butts",
  "title": "bleh bleh bleh",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "python app.py"
  }},{
  	"key": "2",
  "name": "bob",
  "url": "1.1.0",
  "title": "sequel to my garbage",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "python app.py"
  }}
  ]
};

var Work = React.createClass({

  componentDidMount: function () {
    //do something here
  },
  render() {
    return (
      <div className="list">
    	{json.employees.map(work => <div className="list-row" key={work.key}>
      	<Link to={"/work/"+work.url}>{work.title}</Link>
    	</div>)}
  	  </div>
    );
  }
});

export default Work;

