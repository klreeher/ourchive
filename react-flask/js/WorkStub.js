import React from 'react';
import {
  Link
} from 'react-router-dom';

var WorkStub = React.createClass({

  componentDidMount: function () {
    //stuff
  },
  render() {
    return (
      
        <div className="panel-body">
            <div className="col-md-12"><h3><Link to={"/work/"+this.props.work.key}>{this.props.work.title}</Link> by {this.props.work.name}</h3></div>
            <div className="row">
              <div className="col-md-8 col-md-offset-1"><h5>{this.props.work.work_summary}</h5></div>
            </div>
            <div className="row">
              <div className="col-md-2"><h5>Chapters: {Object.keys(this.props.work.chapters).length}</h5></div>
              <div className="col-md-2"><h5>Complete? {this.props.work.is_complete}</h5></div>
              <div className="col-md-2"><h5>Word Count: {this.props.work.word_count}</h5></div>
            </div>
          </div>

    );
  }
});

export default WorkStub;


