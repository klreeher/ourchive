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
				<div className="panel-body">
    				<div className="col-md-12"><h3><Link to={"/work/"+work.key}>{work.title}</Link> by {work.name}</h3></div>
    				<div className="row">
    					<div className="col-md-8 col-md-offset-1"><h5>{work.work_summary}</h5></div>
  					</div>
  					<div className="row">
  						<div className="col-md-2"><h5>Chapters: {Object.keys(work.chapters).length}</h5></div>
    					<div className="col-md-2"><h5>Complete? {work.is_complete}</h5></div>
    					<div className="col-md-2"><h5>Word Count: {work.word_count}</h5></div>
  					</div>
    			</div>
  				
			</div>)}
  	  </div>
    );
  }
});

export default Work;

