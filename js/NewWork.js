import React from 'react';
import axios from 'axios';
import Chapter from './Chapter';
import TagList from './TagList';
import ChapterForm from './ChapterForm';
import { withRouter } from 'react-router-dom';


export default class NewWork extends React.Component {

  addWork(evt, history)
  {
    evt.preventDefault()
    axios.post(this.state.postUrl, {
      title: this.state.title, 
      work_summary: this.state.work_summary, 
      is_complete: this.state.is_complete, 
      work_notes: this.state.work_notes, 
      work_tags: this.state.work_tags, 
      chapters: this.state.chapters
    })
    .then(function (response) {
      history.push({
        pathname: '/work/'+response.data.work_id
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
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
    var oldVal = this.state.is_complete;
    this.setState({
      is_complete: !oldVal
    });
  }
  updateWorkNotes(evt) {
    this.setState({
      work_notes: evt.target.value
    });
  }
  handler(e) {
    e.preventDefault()
    
    var original = this.state.chapters
    original[e.target.parentElement.parentElement.id-1][e.target.name] = e.target.value
    this.setState({
      chapters: original
    })
  }
  uploadAudio(e)
  {
    e.preventDefault()
    var target = e.target
    // Get the selected file from the input element
    var file = e.target.files[0]
    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: "http://127.0.0.1:5000/file-upload",
        chunkSize: 5*1024*1024,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {filename: file.name},
        onError: function(error) {
            console.log("Failed because: " + error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function() {
            console.log("Download %s from %s", upload.file.name, upload.url)

        }
    })
    // Start the upload
    upload.start()
  }
  uploadImage(e)
  {
    e.preventDefault()
    var target = e.target
    // Get the selected file from the input element
    var file = e.target.files[0]
    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: "http://127.0.0.1:9292/audio/",
        chunkSize: 5*1024*1024,
        retryDelays: [0, 1000, 3000, 5000],
        onError: function(error) {
            console.log("Failed because: " + error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function() {
            console.log("Download %s from %s", upload.file.name, upload.url)

        }
    })
    // Start the upload
    upload.start()
  }
  addChapter()
  {
    var newChapter = {title: '', summary: '', chapter_notes: '', image_url: '',
      audio_url: '', text: '', number: 1};
    this.state.chapters.push(newChapter);
  }
  appendChapter(evt)
  {
    evt.preventDefault()
    var key = this.state.chapters.length+1;
    var newChapter = {title: '', chapter_summary: '', chapter_notes: '', image_url: '',
      audio_url: '', text: '', number: key};
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
          this.setState({work_tags: [

              {'id': 1,
               'label': 'fandom',
               'tags': ['buffy', 'the good place']},
              {'id': 2,
               'label': 'pairing',
               'tags': ['buffy/tahani', 'chidi/willow']},
              {'id': 3,
               'label': 'themes',
               'tags': ['soulbonding']}
            ]});  

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  }
  constructor(props) {
    super(props);
    if (this.props.is_edit)
    {
        this.state = {title: this.props.work_title, work_summary: this.props.work_summary, 
          is_complete: this.props.is_complete, work_notes: this.props.work_notes, 
          work_tags: this.props.work_tags, chapters: this.props.work_chapters, is_edit: true,
          work_id: this.props.work_id, postUrl: '/api/works/'+this.props.work_id };
        this.handler = this.handler.bind(this);
        this.uploadAudio = this.uploadAudio.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }
    else
    {
        this.state = {title: '', work_summary: '', is_complete: false, work_notes: '', 
          work_tags: [], chapters: [], is_edit: false, postUrl: '/api/work/'};
        this.addChapter();
        this.handler = this.handler.bind(this);
        this.uploadAudio = this.uploadAudio.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.getTagCategories();
    }    
  }
  componentWillMount() { 
    //todo call get categories
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  
  render() {
    const AddOrUpdate = withRouter(({ history }) => (
    <div> <button onMouseDown={evt => this.addWork(evt, history)} className="btn btn-default">Submit</button>
    </div>
    ))
    return (
      <div>
      <div className="panel panel-default">
        <div className="panel-body">
        <form>
          <div className="form-group">
            <label htmlFor="work_title">Title</label>
            <input id="work_title" className="form-control" value={this.state.title} onChange={evt => this.updateTitle(evt)}></input>
          </div>
          <div className="form-group">
            <label htmlFor="work_author">Author</label>
            <input id="work_author" className="form-control" value="dummyAuthor"></input>
          </div>
          <hr/>
          <div className="form-group">
            <label htmlFor="work_summary">Summary</label>
            <textarea id="work_summary" className="form-control" rows="3" value={this.state.work_summary} onChange={evt => this.updateWorkSummary(evt)}></textarea>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" id="complete" onChange={evt => this.updateCheckbox(evt)}/>Work is complete?
            </label>
          </div>
          <hr/>
          <div className="form-group">
            <label htmlFor="work_notes">Notes</label>
            <input id="work_notes" className="form-control" value={this.state.work_notes} onChange={evt => this.updateWorkNotes(evt)}></input>
          </div>
          <div className="form-group">
          {this.state.work_tags.map(tag => 
              <div key={tag.id}>
                  <TagList tag_category={tag.label} tags={tag.tags} underEdit={true}/>
              </div>
          )}
          </div>
          <br/>
          <br/>
          <hr/>
          <div className="form-group">
          {this.state.chapters.map(chapter => (                        
                        <ChapterForm key={chapter.number} chapter_number={chapter.number} handler={this.handler} handlerAudio={this.uploadAudio}
                        handlerImage={this.uploadImage} chapter={chapter}/>
                    ))}
          </div>
        <div className="form-group">
          <button className="btn btn-link" onMouseDown={evt => this.appendChapter(evt)}>Add Chapter</button>
        </div>
        

      </form>

      <div className="form-group">
          <AddOrUpdate/>
      </div>
        
      </div>
      </div>
      </div>
    );
  }
}