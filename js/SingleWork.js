import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Chapter from './Chapter';
import TagList from './TagList';
import {
  Link, withRouter
} from 'react-router-dom';
import { withAlert } from 'react-alert';
import EditDeleteButtons from './EditDeleteButtons';

class SingleWork extends React.Component {


  bookmarkItem(evt)
  {
    evt.target.blur();
    this.props.history.push({
      pathname: '/bookmarks/new',
      state: { work: this.state.work }
    })
  }

  setWork(work)
  {
    this.state.work = work;
    this.state.current_chapter = work.chapters ? work.chapters[0] : []
    this.state.chapter_index = 0
  }

  getWork(workId)
  {
    axios.get('/api/work/'+workId)
        .then(function (response) {
          this.setState({
            work: response.data,
            current_chapter: response.data.chapters ? response.data.chapters[0] : [],
            chapter_index: 0,
            showAllChapters: this.props.location.search.length > 0
          }, () => {
            var queryParams = new URLSearchParams(this.props.location.search);
            var chapterId = queryParams.get('chapterId');
            var commentId = queryParams.get('commentId');
            if (this.state.showAllChapters)
              {
                var comment = "comment_"+commentId;
                var chapter = "chapter_"+chapterId+"_component";
                this.refs[chapter].toggleComments(null, commentId);
              }
            var cleaned_summary = DOMPurify.sanitize(this.state.work.work_summary);
            var cleaned_notes = DOMPurify.sanitize(this.state.work.work_notes);
            this.setState({
              safe_summary: cleaned_summary,
              safe_notes: cleaned_notes
            })
          });

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  }

  updateWork(evt, workId)
  {
    console.log(evt)
    console.log(workId)
    this.props.history.push({
        pathname: '/create/work/'+workId,
        state: { work: this.state.work, is_edit: true }
      })
  }

  deleteWork(evt, workId)
  {
    evt.preventDefault()
    axios.delete('/api/work/'+workId, {
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
          'CSRF-Token': this.props.csrf
          }})
        .then((response) => {
          this.props.alert.show('Work has been deleted.', {
            timeout: 6000,
            type: 'info'
          })
          this.props.history.push({
            pathname: '/'
          })
        })
        .catch((error) => {
          this.props.alert.show('An error has occurred.', {
            timeout: 6000,
            type: 'error'
          })
      });
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
      chapter_index: 0, user: this.props.user, showAllChapters: false};
    this.updateWork = this.updateWork.bind(this)
    this.deleteWork = this.deleteWork.bind(this)
    this.bookmarkItem = this.bookmarkItem.bind(this)

  }

  componentDidMount()
  {
    this.getWork(this.state.workId);
  }
  componentWillUpdate(nextProps, nextState)
  {
  }


  render() {
    const nextDisabled = this.state.work.chapters === undefined || this.state.chapter_index + 1 >= this.state.work.chapters.length;
    const previousDisabled = this.state.chapter_index === 0;
    const loggedIn = this.state.user != null;
    const actions = []
    if (loggedIn) {
      
      if (this.state.work.username === localStorage.getItem('friendly_name')) {
        var action = {}
        action.actionToDo = this.updateWork;
        action.actionText="Update";
        action.variables=[this.state.work.id]
        actions.push(action)
        var deleteAction = {}
        deleteAction.actionToDo = this.deleteWork;
        deleteAction.actionText="Delete";
        action.variables=[this.state.work.id]
        actions.push(deleteAction)
      }
      var bookmarkAction = {}
      bookmarkAction.actionToDo = this.bookmarkItem;
      bookmarkAction.actionText="Bookmark";
      bookmarkAction.variables=[]
      actions.push(bookmarkAction)
    }
    return (

    <div>
      {this.state.work.id != undefined &&
        <div> 
        {loggedIn && <div className="row">
          <div className="col-xs-3 col-xs-offset-9 float-right">
              <EditDeleteButtons dropdownLabel="Actions" actions={actions}/>
          </div>
        </div>}
        <div className="row">
          <div className="col-xs-12 col-md-12"><h1>{this.state.work.title}</h1></div>
        </div>
        <div className="row">
          <div className="col-xs-9 col-md-12">
            <center><Link to={"/user/"+this.state.work.user_id+"/show"}>{this.state.work.username}</Link></center>
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-xs-9 col-md-12 render-linebreak" dangerouslySetInnerHTML={{ __html: this.state.safe_summary }}></div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-xs-1"><h2>Notes</h2></div>
        </div>
        <div className="row">
          <div className="col-xs-9 render-linebreak" dangerouslySetInnerHTML={{ __html: this.state.safe_notes }}></div>
        </div>
        <div className="row">
          <div className="col-xs-2"><h5>Chapters: {Object.keys(this.state.work.chapters).length}</h5></div>
          <div className="col-xs-2"><h5>Complete? {this.state.work.is_complete}</h5></div>
          <div className="col-xs-2"><h5>Word Count: {this.state.work.word_count}</h5></div>
          <div className="col-md-2"><h5>Type: {this.state.work.type_name}</h5></div>
          <div className="col-xs-2"></div>
        </div>
        <br/>
        <hr/>

        {this.state.work.tags.map(tag =>
          <div className="row" key={tag.id}>
          <div className="col-xs-9 col-md-12">
              <ul className="list-inline">
                <TagList tag_category={tag.label} category_id={tag.id} tags={tag.tags}/>
              </ul>
          </div>
          </div>
        )}


        { this.state.showAllChapters ?

          <div>
            <div className="row">
              <div className="col-md-2 col-md-offset-10" >
                <button className="btn btn-link" onClick={evt => this.toggleAllChapters(evt)}>Hide All Chapters</button>
              </div>
            </div>
            <br/>
            <hr/>
            {this.state.work.chapters.map(chapter =>
              <div className="row" key={chapter.id} id={"chapter_"+chapter.id} ref={"chapter_"+chapter.id}>
                  <Chapter chapter={chapter} user={this.props.user} csrf={this.props.csrf} ref={"chapter_"+chapter.id+"_component"}/>
              </div>
            )}
          </div> :

          <div>
            <div className="row">
              <div className="col-md-2 col-md-offset-10">
                <button className="btn btn-link" onClick={evt => this.toggleAllChapters(evt)}>Show All Chapters</button>
              </div>
            </div>
            <br/>
            <hr/>
            {this.state.current_chapter && <div className="row" id={"chapter_"+this.state.current_chapter.id}>
                <Chapter chapter={this.state.current_chapter} user={this.props.user} csrf={this.props.csrf} />
            </div>  }
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

export default withAlert(withRouter(SingleWork))
