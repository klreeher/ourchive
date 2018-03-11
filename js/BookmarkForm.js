import React from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import TagList from './TagList';
import {FormGroup, Checkbox, ControlLabel, HelpBlock, FormControl, Button, Radio} from 'react-bootstrap';

export default class BookmarkForm extends React.Component {

	addBookmark(evt, history)
	{
		evt.preventDefault()
	    axios.post("/api/bookmark/", {
	      curator_title: this.state.title, 
	      rating: this.state.rating, 
	      description: this.state.description, 
	      is_private: this.state.is_private, 
	      tags: this.state.bookmark_tags, 
	      is_queued: this.state.is_queued,
	      work_id: this.state.work.id,
	      links: []
	    })
	    .then(function (response) {
	      history.push({
	        pathname: '/bookmark/'+response.data.bookmark_id
	      })
	    })
	    .catch(function (error) {
	      console.log(error);
	    });
	}

	constructor(props) {
	    super(props);
	    this.state = this.state = {bookmark: {}, value: "", bookmark_tags: [], work: this.props.location.state.work};
	    this.setDescription = this.setDescription.bind(this);
	    this.setRating = this.setRating.bind(this);
	    this.setTitle = this.setTitle.bind(this);
	    this.updatePrivateCheckbox = this.updatePrivateCheckbox.bind(this);
	    this.updateAddToQueue = this.updateAddToQueue.bind(this);
	    this.create_bookmark_tag = this.create_bookmark_tag.bind(this);
	    this.getTagCategories();
	}

	getTagCategories()
    {
      axios.get('/api/tag/categories')
          .then(function (response) {
            this.setState({bookmark_tags: response.data});  

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }

    create_bookmark_tag(val, oldItem, tags, tag_category) {
    var original = tags;
    var filtered = original.filter(tag => tag == val)
    if (filtered.length > 0 || val == undefined) return
    original.push(val);
    var copy = this.state.bookmark_tags;
    var tags = copy.filter(tag => tag.label == tag_category)[0]
    tags.tags = original
    this.setState({
      bookmark_tags: copy
    })
  }

    setDescription(e) {
    	this.setState({ description: e.target.value });
  	}

  	setRating(e) {
    	this.setState({ rating: parseInt(e.currentTarget.value) });
  	}

  	setTitle(e) {
    	this.setState({ title: e.target.value });
  	}

  	updatePrivateCheckbox(evt) {
	    this.setState({
	      is_private: evt.target.value
	    });
  	}

  	updateAddToQueue(evt) {
	    this.setState({
	      is_queued: evt.target.value
	    });
  	}

  	render() {
  		const AddOrUpdate = withRouter(({ history }) => (
	    <div> <button onMouseDown={evt => this.addBookmark(evt, history)} className="btn btn-default">Submit</button>
	    </div>
	    ))
	    return (
	    	<div className="container">
	    		<div className="row">
	    			<div className="col-xs-1">Work:</div>
	    			<div className="col-xs-10">{this.state.work.title}</div>
	    		</div>
	    		<br/>
			    	<form>
			    		<FormGroup controlId="formControlsTitle">
					      <ControlLabel>Title</ControlLabel>
					      <FormControl componentClass="input" value={this.state.title} 
					      placeholder="Enter a memorable title for your bookmark" 
					      onChange={this.setTitle}
					      />
					    </FormGroup>
					    
					    <FormGroup controlId="formControlsDescription">
					      <ControlLabel>Bookmark Description</ControlLabel>
					      <FormControl  componentClass="textarea" 
					      	value={this.state.description}
					      	placeholder="Enter your review, description, or other curation notes here."
					      	onChange={this.setDescription}
					      />
					    </FormGroup>

					    <FormGroup>
					      <ControlLabel>Rating</ControlLabel>
					      <Radio name="radioGroup" checked={this.state.rating === 1} onChange={this.setRating} value="1">
					        1
					      </Radio>
					      <Radio name="radioGroup" checked={this.state.rating === 2} onChange={this.setRating} value="2">
					        2
					      </Radio>
					      <Radio name="radioGroup" checked={this.state.rating === 3} onChange={this.setRating} value="3">
					        3
					      </Radio>
					      <Radio name="radioGroup" checked={this.state.rating === 4} onChange={this.setRating} value="4">
					        4
					      </Radio>
					      <Radio name="radioGroup" checked={this.state.rating === 5} onChange={this.setRating} value="5">
					        5
					      </Radio>
					    </FormGroup>

					    <FormGroup>
					     <div className="row">
				          {this.state.bookmark_tags.map(tag => 
				              <div key={tag.id}>
				                  <TagList tag_category={tag.label} tags={tag.tags} underEdit={true} createWorkTags={this.create_bookmark_tag}/>
				              </div>
				          )}
				          </div>
				       	</FormGroup>

				       	<FormGroup>
				       	<div className="checkbox">
				            <label>
				              <input type="checkbox" id="private" onChange={evt => this.updatePrivateCheckbox(evt)}/>Bookmark is private?
				            </label>
				        </div>

				        <div className="checkbox">
				            <label>
				              <input type="checkbox" id="private" onChange={evt => this.updateAddToQueue(evt)}/>Add to queue?
				            </label>
				        </div>
				        </FormGroup>

				        </form>

					    <AddOrUpdate/>
			</div>
	    );
  }

}