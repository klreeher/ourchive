import React from 'react';
import axios from 'axios';
import Chapter from './Chapter';
import TagList from './TagList';
import ChapterForm from './ChapterForm';
import { withRouter } from 'react-router-dom';
import { withAlert } from 'react-alert'
import ErrorList from './ErrorList';


class NewWork extends React.Component {

  addWork(evt, history)
  {
    evt.preventDefault()
    if (this.state.title == "")
    {
      this.setState({
        has_errors: true,
        errors: ['The title field is blank. Please add a title.']
      })
      window.scrollTo(0, 0);
      return
    }
    axios.post(this.state.postUrl, {
      title: this.state.title,
      work_summary: this.state.work_summary,
      is_complete: this.state.is_complete,
      work_notes: this.state.work_notes,
      work_tags: this.state.work_tags,
      chapters: this.state.chapters,
      work_id: this.state.work_id,
      work_type: this.state.selected_type
    }, {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
        'CSRF-Token': this.props.csrf
    }})
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
    if (this.state.has_errors && evt.target.value != "") {
          this.setState({
            has_errors: false,
            errors: [],
            title: evt.target.value
          })
          return
    }
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
    var elem = document.getElementById("audio_bar_"+e.target.parentElement.parentElement.id);
    elem.style.height = 25;
    var parent = elem.parentElement;
    parent.style.height=25;
    var chapterUploadId = e.target.parentElement.parentElement.id-1;
    this.setState({
      chapterUploadId: chapterUploadId,
      chapterUploadProperty: e.target.name
    })
    e.preventDefault()
    var target = e.target
    // Get the selected file from the input element
    var file = e.target.files[0]
    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: this.state.tus_endpoint,
        chunkSize: 5*1024*1024,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {filename: file.name},
        onError: function(error) {
            console.log("Failed because: " + error)
        },
        onProgress: (function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            this.updateStatus(percentage, 2, chapterUploadId+1)
        }).bind(this),
        onSuccess: (function() {
            console.log("Download %s from %s", upload.file.name, upload.url)
            this.finishUpload(upload.file.name, upload.url,
              this.state.chapterUploadId, this.state.chapterUploadProperty)
        }).bind(this)
    })
    // Start the upload
    upload.start()
  }
  updateStatus(percentage, key, id){
    if (key == 1) {
      this.setState({
        showImageUpload: true
      }, () => {
        var divId = "image_bar_"+id;
        this.updateStatusBar(divId, percentage);
      })

    }
    if (key == 2) {
      this.setState({
        showAudioUpload: true
      }, () => {
        var divId = "audio_bar_"+id;
        this.updateStatusBar(divId, percentage);
      })

    }

  }

  updateStatusBar(divId, percentage) {
    var elem = document.getElementById(divId);
    var width = percentage;
    elem.style.width = width + '%';
  }
  finishUpload(fileName, url, id, name){
    console.log(url)
    this.setState({
      uploadStatus: "File uploaded: " + fileName
    })
    var original = this.state.chapters
    original[id][name] = url
    this.setState({
      chapters: original
    })

  }
  uploadImage(e)
  {
    var elem = document.getElementById("image_bar_"+e.target.parentElement.parentElement.id);
    elem.style.height = 25;
    var parent = elem.parentElement;
    parent.style.height=25;
    var chapterUploadId = e.target.parentElement.parentElement.id-1;
    this.setState({
      chapterUploadId: chapterUploadId,
      chapterUploadProperty: e.target.name
    })
    e.preventDefault()
    var target = e.target
    // Get the selected file from the input element
    var file = e.target.files[0]
    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: this.state.tus_endpoint,
        chunkSize: 5*1024*1024,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {filename: file.name},
        onError: function(error) {
            console.log("Failed because: " + error)
        },
        onProgress: (function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            this.updateStatus(percentage, 1, chapterUploadId+1)
        }).bind(this),
        onSuccess: (function() {
            console.log("Download %s from %s", upload.file.name, upload.url)
            this.finishUpload(upload.file.name, upload.url,
              this.state.chapterUploadId, this.state.chapterUploadProperty)
        }).bind(this)
    })
    // Start the upload
    upload.start()
  }
  addChapter()
  {
    var newChapter = {title: '', summary: '', chapter_notes: '', image_url: '',
      audio_url: '', text: '', number: 1, image_alt_text: ''};
    this.state.chapters.push(newChapter);
  }
  appendChapter(evt)
  {
    evt.preventDefault()
    var key = this.state.chapters.length+1;
    var newChapter = {title: '', summary: '', chapter_notes: '', image_url: '',
      audio_url: '', text: '', number: key, image_alt_text: ''};
    var original = this.state.chapters;
    original.push(newChapter);
    this.setState({
      chapters: original
    });
  }
  getTagCategories()
  {
    axios.get('/api/tag/categories')
        .then(function (response) {
          this.setState({work_tags: response.data});

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  }
  create_work_tag(val, oldItem, tags, tag_category) {
    var original = tags;
    var filtered = original.filter(tag => tag == val)
    if (filtered.length > 0 || val == undefined) return
    original.push(val);
    var copy = this.state.work_tags;
    var tags = copy.filter(tag => tag.label == tag_category)[0]
    tags.tags = original
    this.setState({
      work_tags: copy
    })
  }
  constructor(props) {
    super(props);
    var friendlyName = localStorage.getItem('friendly_name')
    if (this.props.location.state)
    {
      if(this.props.location.state.work.is_complete == "False")
      {
        var parsedComplete = false;
      }
      else
      {
        var parsedComplete = true;
      }
        this.state = {title: this.props.location.state.work.title, work_summary: this.props.location.state.work.work_summary,
          is_complete: parsedComplete, work_notes: this.props.location.state.work.work_notes,
          work_tags: this.props.location.state.work.tags, chapters: this.props.location.state.work.chapters, is_edit: true,
          work_id: this.props.location.state.work.id, postUrl: '/api/work/'+this.props.location.state.work.id,
          user: this.props.user, username: friendlyName, work_types: [], selected_type: this.props.location.state.work.type_id};
        this.handler = this.handler.bind(this);
        this.uploadAudio = this.uploadAudio.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }
    else
    {
        this.state = {title: '', work_summary: '', is_complete: false, work_notes: '',
          work_tags: [], chapters: [], is_edit: false, postUrl: '/api/work/',
          user: this.props.user, username: friendlyName, work_types: [], selected_type: 1};
        this.addChapter();
        this.handler = this.handler.bind(this);
        this.uploadAudio = this.uploadAudio.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

    }
    this.create_work_tag = this.create_work_tag.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateWorkType = this.updateWorkType.bind(this)
    this.updateStatusBar = this.updateStatusBar.bind(this)
  }
  componentWillMount() {
    //todo call get categories
  }
  componentDidMount() {
      this.getTagCategories();
      axios.get('/api/works/types')
        .then(function (response) {
          this.setState({work_types: response.data});
        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
      axios.get('/api/works/tus')
      .then(function (response) {
        this.setState({tus_endpoint: response.data.tus_endpoint});
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  updateWorkType(evt) {
    this.setState({selected_type: evt.target.value})
  }

  render() {
    const AddOrUpdate = withRouter(({ history }) => (
    <div> <button onMouseDown={evt => this.addWork(evt, history)} className="btn btn-default">Submit</button>
    </div>
    ))
    return (
      <div>
        {this.state.has_errors && <div className="row">
            <ErrorList errors={this.state.errors}/>
          </div>}
        <form>
          <div className="form-group">
            <label htmlFor="work_title">Title</label>
            <input id="work_title" className="form-control" value={this.state.title} onChange={evt => this.updateTitle(evt)}></input>
          </div>
          <div className="form-group">
            <label htmlFor="work_author">Author</label>
            <input id="work_author" className="form-control" value={this.state.username} disabled></input>
          </div>
          <hr/>
          <div className="form-group">
            <label htmlFor="work_type">Type</label>
            <select className="form-control" onChange={evt => this.updateWorkType(evt)} value={this.state.selected_type}>
              {this.state.work_types.map(type =>
                  <option value={type.id}>
                      {type.type_name}
                  </option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="work_summary">Summary</label>
            <textarea id="work_summary" className="form-control" rows="3" value={this.state.work_summary} onChange={evt => this.updateWorkSummary(evt)}></textarea>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" id="complete" onChange={evt => this.updateCheckbox(evt)} checked={this.state.is_complete}/>Work is complete?
            </label>
          </div>
          <hr/>
          <div className="form-group">
            <label htmlFor="work_notes">Notes</label>
            <textarea id="work_notes" className="form-control" rows="3" value={this.state.work_notes} onChange={evt => this.updateWorkNotes(evt)}></textarea>
          </div>
          <div className="form-group">
          {this.state.work_tags.map(tag =>
              <div key={tag.id}>
                  <TagList tag_category={tag.label} category_id={tag.id} tags={tag.tags} underEdit={true} createWorkTags={this.create_work_tag}/>
              </div>
          )}
          </div>
          <br/>
          <br/>
          <hr/>
          <div className="form-group">
          {this.state.chapters.map(chapter => (
                        <ChapterForm key={chapter.number} chapter_number={chapter.number} handler={this.handler} handlerAudio={this.uploadAudio}
                        handlerImage={this.uploadImage} chapter={chapter} showImageUpload={this.state.showUpload}
                        showAudioUpload={this.state.showUpload}/>
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
    );
  }
}

export default withAlert(NewWork)
