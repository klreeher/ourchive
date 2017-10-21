import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class Chapter extends React.Component {


  constructor(props) {
    super(props);
    this.state = {chapter_number: props.chapter_number};
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  render() {
    return (
        <div id={this.state.chapter_number}>
              <div className="form-group">
                <label htmlFor={"chapter_title_"+this.state.chapter_number}>Chapter Title</label>
                <input id={"chapter_title_"+this.state.chapter_number} name="chapter_title" onChange={this.props.handler} className="form-control"></input>
              </div>              
              <div className="form-group">
                <label htmlFor="chapter_summary">Chapter Summary</label>
                <textarea id="chapter_summary" className="form-control" name="chapter_summary" onChange={this.props.handler} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="chapter_notes">Chapter Notes</label>
                <textarea id="chapter_notes" className="form-control" name="chapter_notes" onChange={this.props.handler} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="chapter_image">Chapter Image</label>
                <input className='input-file' type='file' id="chapter_image" className="form-control" name="chapter_image" onChange={this.props.handlerImage}></input>
              </div>
              <div className="form-group">
                <label htmlFor="chapter_audio">Chapter Audio</label>
                <input className='input-file' type='file' id="chapter_audio" className="form-control" name="chapter_audio" onChange={this.props.handlerAudio}></input>
              </div>
              <div className="form-group">
                <label htmlFor="chapter_text">Chapter Text</label>
                <textarea id="chapter_text" className="form-control" name="chapter_text" onChange={this.props.handler} rows="10"></textarea>
              </div>
        </div>

    );
  }
}

