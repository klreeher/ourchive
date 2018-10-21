import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class ChapterForm extends React.Component {


  constructor(props) {
    super(props);    
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  render() {
    return (
        <div id={this.props.chapter_number}>
              <hr/>
              <div className="form-group">
                <div className="row">
                  <div className="col-xs-8"><h3><strong>Chapter {this.props.chapter_number}</strong> <small><button className="btn btn-link" type="button" onMouseDown={evt => this.props.deleteChapter(evt, this.props.chapter_number, this.props.chapter.id)}>DELETE</button></small></h3></div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor={"chapter_title_"+this.props.chapter_number}>Chapter Title</label>
                <input id={"chapter_title_"+this.props.chapter_number} value={this.props.chapter.title}
                  name="title" onChange={this.props.handler} className="form-control"></input>
              </div>              
              <div className="form-group">
                <label htmlFor="summary">Chapter Summary</label>
                <textarea id="summary" className="form-control" name="summary" value={this.props.chapter.summary}
                onChange={this.props.handler} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="chapter_notes">Chapter Notes</label>
                <textarea id="chapter_notes" className="form-control" name="chapter_notes" value={this.props.chapter.chapter_notes}
                onChange={this.props.handler} rows="3"></textarea>
              </div>
              <div className="form-group">
                <div className="progressBar">
                  <div className="progressBarInner" id={"image_bar_"+this.props.chapter_number}></div>
                </div>                
              </div>
              <div className="form-group">
                <label htmlFor="chapter_image">Chapter Image</label>
                <input className='input-file' type='file' id="image_url" className="form-control"
                name="image_url" onChange={this.props.handlerImage}></input>
              </div>
              <div className="form-group">
                <label htmlFor="image_alt_text">Chapter Image Alt Text</label>
                <input className="form-control" id={"image_alt_text_" + this.props.chapter_number}
                name="image_alt_text" onChange={this.props.handler}></input>
              </div>
              <div className="form-group">
                <div className="progressBar">
                  <div className="progressBarInner" id={"audio_bar_"+this.props.chapter_number}></div>
                </div>                
              </div>
              <div className="form-group">
                <label htmlFor="chapter_audio">Chapter Audio</label>
                <input className='input-file' type='file' id="audio_url" className="form-control" name="audio_url" 
                  onChange={this.props.handlerAudio}></input>
              </div>
              <div className="form-group">
                <label htmlFor="chapter_text">Chapter Text</label>
                <textarea id="text" className="form-control" name="text" onChange={this.props.handler} rows="10" value={this.props.chapter.text}></textarea>
              </div>
        </div>

    );
  }
}

