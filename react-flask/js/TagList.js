import React from 'react';
import {
  Link
} from 'react-router-dom';
import TagItem from './TagItem';

export default class TagList extends React.Component {


  constructor(props) {
    super(props);
    this.state = {tags: props.tags[0], tag_category: props.tag_category};
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
      <hr/>
      <div className="col-md-3 tag_category">{this.state.tag_category}</div>
          {this.state.tags.map(tag => 
              <TagItem tag={tag}/>
          )}
      </div>
    );
  }
}

