import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class Chapter extends React.Component {


  constructor(props) {
    super(props);
    this.state = {chapter: props.chapter};
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  
  render() {
    return (
      <div>
        <div className="work_text">
  <div className="row">
    <div className="col-md-12"><h2>{this.state.chapter.title}</h2></div>
  </div>
  <div className="row">
    <div className="col-md-12"><blockquote>{this.state.chapter.chapter_summary}</blockquote></div>
  </div>
  <hr/>

    <div className="row">
      <div className="col-md-12">
        {this.state.chapter.text}
      </div>
    </div>
</div>
      </div>
    );
  }
}

