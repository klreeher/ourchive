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
  toggleAllChapters(evt)
  {
    evt.target.blur();
    var currentVal = this.state.showAllChapters;
    this.setState({
      showAllChapters: !currentVal
    })
  }

  constructor(props) {
    super(props);    
    this.state = {workId: props.match.params.workId, work: [], current_chapter: [],
      chapter_index: 0, viewer_is_creator: false, user: this.props.user, showAllChapters: false};
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
    const nextDisabled = this.state.work.chapters === undefined || this.state.chapter_index + 1 >= this.state.work.chapters.length;
    const previousDisabled = this.state.chapter_index === 0;
    const loggedIn = this.state.user != null;
    return (

    <div className="container-fluid">
      {this.state.work.id != undefined && 
        <div>
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
          <div className="row" key={Math.random()}>
          <div className="col-md-12">
              <ul className="list-inline">
                <TagList tag_category={Object.keys(tag)} tags={Object.values(tag)}/>
              </ul>
          </div> 
          </div>
        )}
        <br/>
        <hr/>
        
        { this.state.showAllChapters ? 

          <div>
            <div className="row">
              <div className="col-md-2 col-md-offset-10">
                <button className="btn btn-link" onClick={evt => this.toggleAllChapters(evt)}>Hide All Chapters</button>
              </div>
            </div>
              
            {this.state.work.chapters.map(chapter => 
              <div className="row" key={chapter.id}>
                <div className="col-md-12">
                  <Chapter chapter={chapter} user={this.props.user}/> 
                </div>
              </div>
            )}
          </div> :

          <div>
            <div className="row">
              <div className="col-md-2 col-md-offset-10">
                <button className="btn btn-link" onClick={evt => this.toggleAllChapters(evt)}>Show All Chapters</button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Chapter chapter={this.state.current_chapter} user={this.props.user}/>
              </div>
            </div>  
            <button className="btn btn-link" onMouseDown={evt => this.previousChapter(evt)} disabled={previousDisabled}>Previous Chapter</button>
            <button className="btn btn-link" onMouseDown={evt => this.nextChapter(evt)} disabled={nextDisabled}>Next Chapter</button>
          </div>


        }
        
        
        <br/>
        <br/>
        </div>
      }
      {
        this.state.work.id === undefined && <div></div>
      }
    </div>
      
    );
  }
}