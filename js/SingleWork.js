import React from 'react';
import axios from 'axios';
import Chapter from './Chapter';
import TagList from './TagList';
import {
  Link
} from 'react-router-dom';

export default class SingleWork extends React.Component {

  setWork(work)
  {
    this.state.work = work;
    this.state.current_chapter = work.chapters[0]
    this.state.chapter_index = 0
  }

  getWork(workId)
  {
  axios.get('/api/work/'+workId)
      .then(function (response) {
        this.setState({
          work: response.data[0],
          current_chapter: response.data[0].chapters[0],
          chapter_index: 0,
          viewer_is_creator: true
        });  

      }.bind(this))
      .catch(function (error) {
        console.log(error);
    });
  }

  updateWork(workId)
  {

  }

  deleteWork(workId)
  {

  }
  nextChapter(evt)
  {
    var nextIndex = this.state.chapter_index + 1
    var nextChapter = this.state.work.chapters[nextIndex]
    this.setState({
      current_chapter: nextChapter,
      chapter_index: nextIndex
    })
  }
  previousChapter()
  {
    var previousIndex = this.state.chapter_index - 1
    var previousChapter = this.state.work.chapters[previousIndex]
    this.setState({
      current_chapter: previousChapter,
      chapter_index: previousIndex
    })
  }
  constructor(props) {
    super(props);
    var empty = {
  "key": "1",
  "creator_id": 1,
  "name": "barb",
  "url": "butts",
  "title": "bleh bleh bleh",
  "main": "index.js",
  "is_complete": "yes",
  "word_count": "100",
  "work_summary": "another terrible fic",
  "chapters": [{
    "id": "1",
    "number": "1",
    "title": "bob goes to school",
    "chapter_summary": "stuff happens",
    "text": "weh weh weh weh",
    "audio_url": "url",
    "image_url": "url"
  },
    {"id": "2",
    "number": "2",
    "title": "bob fails at school",
    "chapter_summary": "stuff happens",
    "text": "bob sux",
    "audio_url": "url",
    "image_url": "url"}],
  "chapter_count": "5",
  "tags": [{
    "fandom": ["hobbits", "star trek"]},
    {"primary pairing": ["trip tucker / thorin"]}]};
    this.state = {workId: props.match.params.workId, work: empty, current_chapter: empty.chapters[0],
      chapter_index: 0, viewer_is_creator: false, user: this.props.user};
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
    const nextDisabled = this.state.chapter_index + 1 >= this.state.work.chapters.length;
    const previousDisabled = this.state.chapter_index === 0;
    const loggedIn = this.state.user != null;
    return (
      <div>
        <div className="panel panel-default">
        <div className="panel-body">
          <div className={this.state.viewer_is_creator ? "viewer-creator row" : "viewer row"}>
          <div className="col-md-3">
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </div>
        
  <div className="row">
    <div className="col-md-12"><h1>{this.state.work.title}</h1></div>
  </div>
  <div className="row">
    <div className="col-md-12">
      <center><Link to={"/user/"+this.state.work.creator_id}>{this.state.work.name}</Link></center>
    </div>
  </div>
  <hr/>
  <div className="row">
    <div className="col-md-12"><h4>{this.state.work.work_summary}</h4></div>
  </div>
  <div className="row">
    <div className="col-md-2 col-md-offset-4"><h5>Chapters: {Object.keys(this.state.work.chapters).length}</h5></div>
    <div className="col-md-2"><h5>Complete? {this.state.work.is_complete}</h5></div>
    <div className="col-md-2"><h5>Word Count: {this.state.work.word_count}</h5></div>
    <div className="col-md-2"></div>
  </div>
  <br/>
  <hr/>
  
      {this.state.work.tags.map(tag => 
        <div className="row">
        <div className="col-md-12">
            <ul className="list-inline">
              <TagList tag_category={Object.keys(tag)} tags={Object.values(tag)}/>
            </ul>
        </div> 
        </div>
      )}
  <br/>
  <hr/>
  <div className="row">
    <div className="col-md-12">
      <Chapter chapter={this.state.current_chapter}/>
    </div>
  </div>  
  <button className="btn btn-link" onMouseDown={evt => this.previousChapter(evt)} disabled={previousDisabled}>Previous Chapter</button>
  <button className="btn btn-link" onMouseDown={evt => this.nextChapter(evt)} disabled={nextDisabled}>Next Chapter</button>
  </div>
  </div>
      </div>
    );
  }
}