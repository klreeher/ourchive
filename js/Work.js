import React from 'react';
import {
  Link
} from 'react-router-dom';
import WorkStub from './WorkStub';

var json = {
	"works": 
	[
	{
	"key": "1",
  "name": "barb",
  "creator_id": 1,
  "url": "butts",
  "title": "bleh bleh bleh",
  "main": "index.js",
  "is_complete": "yes",
  "word_count": "100",
  "work_summary": "another terrible fic",
  "chapter_count": "5"},{
  	"key": "2",
    "creator_id": 2,
  "name": "bob",
  "url": "1.1.0",
  "title": "sequel to my garbage",
  "main": "index.js",
  "is_complete": "yes",
  "word_count": "100",
  "work_summary": "another terrible fic",
  "chapter_count": "5"}
  ]
};

var Work = React.createClass({

  componentDidMount: function () {
    //do something here
  },
  render() {
    return (
      <div className="list">
    	{json.works.map(work => 
    		<div className="list-row panel panel-default" key={work.key}>
    			<WorkStub work={work}/>
    		</div>
    		)}
  	  </div>
    );
  }
});

export default Work;

