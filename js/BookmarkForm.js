import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import TagList from './TagList';
import {FormGroup, Checkbox, ControlLabel, HelpBlock, FormControl, Button, Radio} from 'react-bootstrap';

export default class BookmarkForm extends React.Component {

	addBookmark(evt)
	{
		evt.preventDefault()
		console.log(this.state)
	}

	constructor(props) {

		var json = {
		
		  "key": "1",
	      "chapter_image": "butts.png",
	      "title": "bleh bleh bleh",
	      "creator": "impertinence",
	      "summary": "someBODY once told me the world is gonna roll me",
	      "links": [1, 2],
	      "tags": [
	        {"fandom": ["buffy", "xena"]},
	        {"primary pairing": ["buffy/faith"]}
	      ]
	  	};
	    super(props);
	    this.state = this.state = {bookmark: json, value: ""};
	    this.setDescription = this.setDescription.bind(this);
	    this.setRating = this.setRating.bind(this);

	}

    setDescription(e) {
    	this.setState({ description: e.target.value });
  	}

  	setRating(e) {
    	this.setState({ rating: parseInt(e.currentTarget.value) });
  	}


  	render() {
	    return (
	    	<div className="panel panel-default">
	        	<div className="panel-body">
			    	<form>
			    		<FormGroup controlId="formControlsTitle">
					      <ControlLabel>Title</ControlLabel>
					      <FormControl.Static>{this.state.bookmark.title} </FormControl.Static>
					      <HelpBlock>The work's title</HelpBlock>
					    </FormGroup>

					    <FormGroup controlId="formControlsSummary">
					      <ControlLabel>Summary</ControlLabel>
					      <FormControl.Static>{this.state.bookmark.summary} </FormControl.Static>
					      <HelpBlock>The work's summary</HelpBlock>
					    </FormGroup>
					    
					    <FormGroup controlId="formControlsDescription">
					      <ControlLabel>Summary</ControlLabel>
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
				          {this.state.bookmark.tags.map(tag => 
				              <div key={Object.keys(tag)}>
				                  <TagList tag_category={Object.keys(tag)} tags={Object.values(tag)} underEdit={true}/>
				              </div>
				          )}
				       	</FormGroup>

					    <div className="form-group">
				          <button onMouseDown={evt => this.addBookmark(evt)} className="btn btn-default">Submit</button>
				        </div>
					  </form>
				</div>
			</div>
	    );
  }

}