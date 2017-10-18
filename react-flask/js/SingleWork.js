import React from 'react';
import axios from 'axios';
import TagItem from './TagItem';

export default class SingleWork extends React.Component {

  setWork(work)
  {
    this.work = work;
  }

  getWork(workId)
  {
  axios.get('/api/work/'+workId)
      .then(function (response) {
        this.setState({work: response.data[0]});     
      }.bind(this))
      .catch(function (error) {
        console.log(error);
    });
  }
  constructor(props) {
    super(props);
    var empty = {
  "key": "1",
  "name": "barb",
  "url": "butts",
  "title": "bleh bleh bleh",
  "main": "index.js",
  "is_complete": "yes",
  "word_count": "100",
  "work_summary": "another terrible fic",
  "chapters": {},
  "tags": [{"id": "empty"}]};
    this.state = {workId: props.match.params.workId, work: empty};
  }
  componentWillMount() { 
    this.getWork(this.state.workId); 
  }
  componentWillUpdate(nextProps, nextState)
  {
    //this.state.workId = nextProps.match.params.workId;
    //this.getWork(this.state.workId);
  }

  
  render() {
    return (
      <div>
        <h3>{this.state.workId}</h3>
        <div className="panel panel-default">
        <div className="panel-body">
  <div className="row">
    <div className="col-md-12"><h1>{this.state.work.title}</h1></div>
  </div>
  <div className="row">
    <div className="col-md-12"><h2>{this.state.work.name}</h2></div>
  </div>
  <hr/>
  <div className="row">
    <div className="col-md-12"><h4>{this.state.work.work_summary}</h4></div>
  </div>
  <div className="row">
    <div className="col-md-2 col-md-offset-6"><h5>Chapters: {Object.keys(this.state.work.chapters).length}</h5></div>
    <div className="col-md-2"><h5>Complete? {this.state.work.is_complete}</h5></div>
    <div className="col-md-2"><h5>Word Count: {this.state.work.word_count}</h5></div>
  </div>
  </div>
  <div className="panel-footer">
  <div className="row">
    <div className="col-md-12">
      {this.state.work.tags.map(tag => 
          <div key={tag.id}>
            <TagItem tag={tag}/>
          </div>
        )}
    </div>
  </div> 
  </div>
  </div>
      </div>
    );
  }
}