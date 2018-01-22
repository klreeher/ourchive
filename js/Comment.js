import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class Comment extends React.Component {


  constructor(props) {
    super(props);
    this.state = {comment: props.comment};
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.state.comment.userName} says:</div>
        <div className="panel-body">
            {this.state.comment.text}
          <div className="row">
            <button className="btn btn-link">Reply</button>
          </div>
          <div className="row">
            {this.state.comment.comments.map(comment => 
              <div key={comment.id} className="col-md-12">
                <Comment comment={comment} user={this.props.user}/>
              </div>              
              )}
          </div>
        </div>
      </div>
    );
  }
}

