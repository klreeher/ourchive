import React from 'react';
import {
  Link
} from 'react-router-dom';
import TagItem from './TagItem';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { withAlert } from 'react-alert';


const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

class TagList extends React.Component {


  constructor(props) {
    super(props);
    if (props.tags != null) {
      this.state = {tags: props.tags, tag_category: props.tag_category, category_id: props.category_id, oldItem: '', value: '', suggestions: [],
      underEdit: props.underEdit};
    }
    else
    {
      this.state = {tags: [], tag_category: props.tag_category, oldItem: '', value: '', suggestions: [],
      underEdit: props.underEdit};
    }
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.newTagAuto = this.newTagAuto.bind(this);
    this.newTag = this.newTag.bind(this);
  }
  componentWillMount() {
    //do things
  }
  onChange(event, newValue) {
    var newVal = newValue["newValue"]
    if (newVal != '') {
      if (newVal.slice(-1) == ',') {
          var oldVal = newVal.slice(0, -1)
          this.props.createWorkTags(oldVal, '', this.state.tags, this.state.tag_category);
          event.preventDefault();
          this.setState({
            value: ""
          })
          return

      }
    }
   this.setState({
        value: newValue["newValue"]
      })
  }

  onSuggestionsFetchRequested(value) {
    if (this.props.category_id === undefined || this.props.category_id < 1) {
      return
    }
    var cleaned = DOMPurify.sanitize(value.value);
    axios.get('/api/tag/'+this.props.category_id+'/suggestions/'+cleaned)
        .then(function (response) {
          if (!('results' in response.data)) {
            this.props.removeWorkTag(this.props.category_id, cleaned)
            return
          }
          this.setState({
            suggestions: response.data["results"]
          })

        }.bind(this))
        .catch(function (error) {
          console.log(error)
          this.props.alert.show('Suggestions can\'t be fetched for this tag.', {
            timeout: 6000,
            type: 'error'
          })
      }.bind(this));
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    })
  }


  newTag(event) {
    var characterPressed = String.fromCharCode(event.which);
    console.log(characterPressed);
    if (characterPressed == ',') {
      if (event.target.value != '') {
        var oldVal = event.target.value
        event.target.value = ''
        var id = event.target.id.charAt(0);
        var oldItem = event.target.parentElement
        this.props.createWorkTags(oldVal, oldItem, this.props.tags, this.props.tag_category);
        this.setState({
          oldItem: oldItem
        })
        event.preventDefault();

      }
    }
  }
  newTagAuto(event, suggestion) {
    var oldVal = event.target.value
    event.target.value = ''
    this.props.createWorkTags(suggestion.suggestionValue, '', this.props.tags, this.props.tag_category);
    event.preventDefault();
    this.setState({
      value: ""
    })
  }
  render() {
    const { value, suggestions } = this.state;
     // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Add a tag...',
      value,
      onChange: this.onChange
    };
    return (
      <div>
        <div className="row">
            <div className="col-md-3 tag_category">
              {this.props.tag_category}
            </div>
        </div>
        <div className="row">
            <div className="col-md-5">
              <ul className="list-inline" id={"tags_ul"+this.state.tag_category}>
                  {this.props.tags && this.props.tags.map(tag =>
                    <div key={tag}>
                      <TagItem tag={tag} removeTag={this.props.removeWorkTag} underEdit={this.state.underEdit} category={this.state.category_id}/>
                    </div>
                  )}
              </ul>
            </div>


          {this.state.underEdit &&
            <div className="col-md-4">
              <Autosuggest id={"autosuggest"+this.state.tag_category}
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={this.newTagAuto}
              />
            </div>
          }
          </div>
      </div>
    );
  }
}

export default withAlert(TagList)
