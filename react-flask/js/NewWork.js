import React from 'react';
import axios from 'axios';
import Chapter from './Chapter';
import TagList from './TagList';
import ChapterForm from './ChapterForm';

export default class NewWork extends React.Component {

  updateTitle(evt) {
    this.setState({
      title: evt.target.value
    });
  }

  updateWorkSummary(evt) {
    this.setState({
      work_summary: evt.target.value
    });
  }
  updateCheckbox(evt) {
    this.setState({
      is_complete: evt.target.value
    });
  }
  updateWorkNotes(evt) {
    this.setState({
      work_notes: evt.target.value
    });
  }
  addChapter()
  {
    var newChapter = {chapter_title: '', chapter_summary: '', chapter_notes: '', chapter_image: '',
      chapter_audio: '', chapter_text: '', chapter_key: 1};
    this.state.chapters.push(newChapter);
  }
  appendChapter(evt)
  {
    var key = this.state.chapters.length+1;
    var newChapter = {chapter_title: '', chapter_summary: '', chapter_notes: '', chapter_image: '',
      chapter_audio: '', chapter_text: '', chapter_key: key};
    var original = this.state.chapters;
    original.push(newChapter);
    this.setState({
      chapters: original
    });
    
  }
  saveWork()
  {
    axios.post('/api/work/new')
      .then(function (response) {
        this.setState({work: response.data[0]});  

      }.bind(this))
      .catch(function (error) {
        console.log(error);
    });
  }
  getTagCategories()
  {
  axios.get('/api/tag/categories')
      .then(function (response) {
        this.setState({work: response.data[0]});  

      }.bind(this))
      .catch(function (error) {
        console.log(error);
    });
  }
  constructor(props) {
    super(props);
    this.state = {title: '', work_summary: '', is_complete: false, work_notes: '', 
      work_tags: [], chapters: []};
    this.addChapter();
  }
  componentWillMount() { 
    //todo call get categories
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  
  render() {
    return (
      <div>
        <form>
          <div className="form-group">
            <label for="work_title">Title</label>
            <input id="work_title" className="form-control" value={this.state.title} onChange={evt => this.updateTitle(evt)}></input>
          </div>
          <div className="form-group">
            <label for="work_author">Author</label>
            <input id="work_author" className="form-control" value="dummyAuthor"></input>
          </div>
          <hr/>
          <div className="form-group">
            <label for="work_summary">Summary</label>
            <textarea id="work_summary" className="form-control" rows="3" value={this.state.work_summary} onChange={evt => this.updateWorkSummary(evt)}></textarea>
          </div>
          <div className="form-group">
              <input type="checkbox" id="complete" onChange={evt => this.updateCheckbox(evt)}/>
              <label htmlFor="complete">Work is complete?</label> 
          </div>
          <hr/>
          <div className="form-group">
            <label for="work_notes">Notes</label>
            <input id="work_notes" className="form-control" value={this.state.work_notes} onChange={evt => this.updateWorkNotes(evt)}></input>
          </div>
          {this.state.work_tags.map(tag => 
            <div className="row">
              <div className="col-md-12">
                <ul className="list-inline">
                  <TagList tag_category={Object.keys(tag)} tags={Object.values(tag)}/>
                </ul>
              </div> 
            </div>
          )}
          
          {this.state.chapters.map(chapter => (
                        <ChapterForm key={chapter.chapter_key} chapter_number={chapter.chapter_key}/>
                    ))}
          
        <button type="submit" className="btn btn-default">Submit</button>
      </form>
      <button onClick={evt => this.appendChapter(evt)}>Add Chapter</button>
      </div>
    );
  }
}