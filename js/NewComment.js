import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class NewComment extends React.Component {


  constructor(props) {
    super(props);
    this.state = {comment: props.comment, user: props.user};
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }

  render() {
    return (
      <div className="text-padding">
        <div className="row">
          <div className="col-xs-8 col-md-12">
            <textarea value={this.props.newCommentText} rows="3"
                onChange={this.props.updateNewCommentText} className="form-control col-xs-6 col-md-12"></textarea>
            
          </div>
        </div>
        <br/>
        <div className="row pull-right">
          <div className="col-xs-6 col-md-12">
            <button onClick={this.props.addComment}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

