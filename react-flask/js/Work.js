import React from 'react';
import {
  Link
} from 'react-router-dom';
import WorkStub from './WorkStub';

var json = {
	"employees": 
	[
	{
	"key": "1",
  "name": "barb",
  "url": "butts",
  "title": "bleh bleh bleh",
  "main": "index.js",
  "is_complete": "yes",
  "word_count": "100",
  "work_summary": "another terrible fic",
  "chapters": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "python app.py"
  }},{
  	"key": "2",
  "name": "bob",
  "url": "1.1.0",
  "title": "sequel to my garbage",
  "main": "index.js",
  "is_complete": "yes",
  "word_count": "100",
  "work_summary": "another terrible fic",
  "chapters": {
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
    	{json.employees.map(work => 
    		<div className="list-row panel panel-default" key={work.key}>
    			<WorkStub work={work}/>
    		</div>
    		)}
  	  </div>
    );
  }
});

export default Work;

