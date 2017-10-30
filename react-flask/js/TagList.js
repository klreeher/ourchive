import React from 'react';
import {
  Link
} from 'react-router-dom';
import TagItem from './TagItem';
import Autosuggest from 'react-autosuggest';


// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

export default class TagList extends React.Component {


  constructor(props) {
    super(props);
    this.state = {tags: props.tags[0], tag_category: props.tag_category, oldItem: '', value: '', suggestions: []};
    this.removeTag = this.removeTag.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
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
  onChange(event, newValue) {
    this.setState({
      value: newValue
    })
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested(value) {
    this.setState({
      suggestions: getSuggestions(value)
    })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    })
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
    const { value, suggestions } = this.state;
     // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange
    };
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
          <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
        </div> 
      </div>
    );
  }
}

