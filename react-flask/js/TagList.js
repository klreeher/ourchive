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
        <div className="col-md-2">{this.state.tag_category}</div>
        <div className="col-md-10"><ul>
          {this.state.tags.map(tag => 
            <div key={tag}>
              <TagItem tag={tag}/>
            </div>
          )}
        </ul></div></div>
    );
  }
}

