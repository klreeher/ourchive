import React from 'react';
import {
  Link
} from 'react-router-dom';

export default class TagItem extends React.Component {


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
  
  
  render() {
    return (
        <li className="tag_li" id={this.state.tag}>{this.state.tag}<a className="close_icon_link" onClick={this.props.removeTag}><span className="close_icon">x</span></a></li>
    );
  }
}

