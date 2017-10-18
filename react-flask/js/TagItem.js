import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class SingleWork extends React.Component {


  constructor(props) {
    super(props);
    this.state = {tag: props.tag};
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  removeTag(event)
  {
  	var target = event.target.parentElement.parentElement;
  	target.remove();
  }
  
  render() {
    return (
      <div>
        <li className="tag_li" id={this.state.tag.id}>{this.state.tag.text}<a className="close_icon_link" onClick={this.removeTag}><span className="close_icon">x</span></a></li>
      </div>
    );
  }
}

