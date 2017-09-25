import React from 'react';

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
      	<a href={work.url}>{work.title}</a>
    	</div>)}
  	  </div>
    );
  }
});

export default Work;

