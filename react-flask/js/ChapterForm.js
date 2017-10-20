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
                <label for="chapter_title">Chapter Title</label>
                <input id="chapter_title" className="form-control"></input>
              </div>              
              <div className="form-group">
                <label for="chapter_summary">Chapter Summary</label>
                <textarea id="chapter_summary" className="form-control" rows="3"></textarea>
              </div>
        </div>
    );
  }
}

