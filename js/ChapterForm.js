import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class ChapterForm extends React.Component {


  constructor(props) {
    super(props);    
    this.state = {number: props.chapter_number, chapter: props.chapter};
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  render() {
    return (
        <div id={this.state.number}>
              <div className="form-group">
                <label htmlFor={"chapter_title_"+this.state.number}>Chapter Title</label>
                <input id={"chapter_title_"+this.state.number} value={this.state.chapter.title}
                  name="title" onChange={this.props.handler} className="form-control"></input>
              </div>              
              <div className="form-group">
                <label htmlFor="summary">Chapter Summary</label>
                <textarea id="summary" className="form-control" name="summary" value={this.state.chapter.summary}
                onChange={this.props.handler} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="chapter_notes">Chapter Notes</label>
                <textarea id="chapter_notes" className="form-control" name="chapter_notes" value={this.state.chapter.chapter_notes}
                onChange={this.props.handler} rows="3"></textarea>
              </div>
              <div className="form-group">
                <div className="progressBar">
                  <div className="progressBarInner" id={"image_bar_"+this.state.number}></div>
                </div>                
              </div>
              <div className="form-group">
                <label htmlFor="chapter_image">Chapter Image</label>
                <input className='input-file' type='file' id="image_url" className="form-control"
                name="image_url" onChange={this.props.handlerImage}></input>
              </div>
              <div className="form-group">
                <label htmlFor="image_alt_text">Chapter Image Alt Text</label>
                <input className="form-control" id={"image_alt_text_" + this.state.number}
                name="image_alt_text" onChange={this.props.handler}></input>
              </div>
              <div className="form-group">
                <div className="progressBar">
                  <div className="progressBarInner" id={"audio_bar_"+this.state.number}></div>
                </div>                
              </div>
              <div className="form-group">
                <label htmlFor="chapter_audio">Chapter Audio</label>
                <input className='input-file' type='file' id="audio_url" className="form-control" name="audio_url" 
                  onChange={this.props.handlerAudio}></input>
              </div>
              <div className="form-group">
                <label htmlFor="chapter_text">Chapter Text</label>
                <textarea id="text" className="form-control" name="text" onChange={this.props.handler} rows="10" value={this.state.chapter.text}></textarea>
              </div>
        </div>

    );
  }
}

