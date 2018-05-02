import React from 'react';
import {
  Link
} from 'react-router-dom';


export default class WorkStub extends React.Component {

  componentDidMount() {
    //stuff
  }
  render() {
    return (
      
        <div className="panel-body">
            <div className="col-md-12"><h3><Link to={"/work/"+this.props.work.id}>{this.props.work.title}</Link> by <Link to={"/user/"+this.props.work.user_id}>{this.props.work.username}</Link></h3></div>
            <div className="row">
              <div className="col-md-8 col-md-offset-1"><h5>{this.props.work.work_summary}</h5></div>
            </div>
            <div className="row">
              <div className="col-md-2"><h5>Chapters: {this.props.work.chapter_count}</h5></div>
              <div className="col-md-2"><h5>Complete? {this.props.work.is_complete}</h5></div>
              <div className="col-md-2"><h5>Word Count: {this.props.work.word_count}</h5></div>
              <div className="col-md-2"><h5>Type: {this.props.work.type_name}</h5></div>
            </div>
          </div>

    );
  }
}


