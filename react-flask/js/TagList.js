import React from 'react';
import {
  Link
} from 'react-router-dom';
import TagItem from './TagItem';

export default class TagList extends React.Component {


  constructor(props) {
    super(props);
    this.state = {tags: props.tags[0], tag_category: props.tag_category, oldItem: ''};
    this.removeTag = this.removeTag.bind(this);
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
    //do things
  }
  componentDidUpdate() {
    if (this.state.oldItem !== '')
    {
      document.getElementById("tags_ul"+this.state.tag_category).appendChild(this.state.oldItem)
      document.getElementById("new_textBox"+this.state.tag_category).focus()
      this.state.oldItem = ''
    }    
  }
  removeTag(event)
  {
    event.preventDefault()
    var oldTags = this.state.tags
    var tagText = event.target.parentElement.parentElement.id
    var newTags = oldTags.filter(tag => tag !== tagText);
    this.setState({
      tags: newTags
    })
  }
  create_work_tag(val, oldItem) {
    var original = this.state.tags;
    var filtered = original.filter(tag => tag == val)
    if (filtered.length > 0) return
    original.push(val);
    this.setState({
      tags: original,
      oldItem: oldItem
    })
  }
  newTag(event) {
    var characterPressed = String.fromCharCode(event.which);
    if (characterPressed == ',') {
      if (event.target.value != '') {
        var oldVal = event.target.value
        event.target.value = ''
        var id = event.target.id.charAt(0);
        var oldItem = event.target.parentElement
        this.create_work_tag(oldVal, oldItem);
        event.preventDefault();

      }
    }
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <ul className="list-inline" id={"tags_ul"+this.state.tag_category}>
            <hr/>
            <div className="col-md-3 tag_category">{this.state.tag_category}</div>
                {this.state.tags.map(tag => 
                  <div key={tag}>
                    <TagItem tag={tag} removeTag={this.removeTag}/>
                  </div>
                )}
                <li className="new_li"><input type="text" id={"new_textBox"+this.state.tag_category} className="new_textBox" onKeyPress={evt => this.newTag(evt)}/></li>
          </ul>
        </div> 
      </div>
    );
  }
}

