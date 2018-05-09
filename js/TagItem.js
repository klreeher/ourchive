import React from 'react';
import {
  Link, withRouter
} from 'react-router-dom';

export default class TagItem extends React.Component {


  constructor(props) {
    super(props);
    this.state = {tag: props.tag, category_id: props.category, underEdit: props.underEdit};
  }
  componentWillMount() { 
    //do things
  }
  componentWillUpdate(nextProps, nextState)
  {
  }
  
  goToTag(evt, history) {
    evt.target.blur();
    var cleaned = this.state.tag.replace('/', '%2F')
    history.push({
      pathname: '/tag/'+this.state.category_id+'/'+cleaned,
      state: { category_id: this.state.category_id, tag: this.state.tag }
    })
  }
  
  render() {
    const TagLink = withRouter(({ history }) => (
      <li className="tag_li" id={this.state.tag}>
      <span onMouseDown={evt => this.goToTag(evt, history)}>{this.state.tag}</span> {this.state.underEdit && 
          <a className="close_icon_link" onClick={this.props.removeTag}><span className="close_icon">x</span></a>
        }</li>
    ))
    return (
        <TagLink/>        
    );
  }
}

