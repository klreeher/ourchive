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
          <div className="col-xs-10">
            <textarea value={this.props.newCommentText} rows="3"
                onChange={this.props.updateNewCommentText} className="form-control"></textarea>
            
          </div>
        </div>
        <br/>
        <div className="row">
          <div className="col-xs-10">
            <button onClick={this.props.addComment}>Add Reply</button>
          </div>
        </div>
        <br/> 
      </div>
    );
  }
}

