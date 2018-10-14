import React from 'react';
import axios from 'axios';
import { withRouter, Link} from 'react-router-dom';
import TagList from './TagList';
import ErrorList from './ErrorList';
import { withAlert } from 'react-alert';
import {FormGroup, Checkbox, ControlLabel, HelpBlock, FormControl, Button, Radio} from 'react-bootstrap';

class BookmarkForm extends React.Component {

	addBookmark(evt, history)
	{
		evt.preventDefault()
		if (this.state.title == "")
		{
			this.setState({
				has_errors: true,
				errors: ['The title field is blank. Please add a title.']
			})
			window.scrollTo(0, 0);          
			return
		}
	    axios.post(this.state.post_url, {
	      curator_title: this.state.title, 
	      rating: this.state.rating, 
	      description: this.state.description, 
	      is_private: this.state.is_private, 
	      tags: this.state.bookmark_tags, 
	      is_queued: this.state.is_queued,
	      work_id: this.state.work.id,
	      links: [],
	      id: this.state.id
	    }, {   
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
      'CSRF-Token': this.props.csrf
    }})
	    .then(function (response) {
	      history.push({
	        pathname: '/bookmark/'+response.data.bookmark_id
	      })
	    })
	    .catch(function (error) {
	      this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
        })
	   });
	}

	constructor(props) {
	    super(props);
	    if (this.props.location.state && this.props.location.state.bookmark)
	    {
	        this.state = {bookmark: this.props.location.state.bookmark, title: this.props.location.state.bookmark.curator_title,
	        	rating: this.props.location.state.bookmark.rating, description: this.props.location.state.bookmark.description,
	        	is_private: this.props.location.state.bookmark.is_private, is_queued: this.props.location.state.bookmark.is_queued,
	        	work: this.props.location.state.bookmark.work, links: this.props.location.state.bookmark.links,
	        	bookmark_tags: this.props.location.state.bookmark.tags, id: this.props.location.state.bookmark.id,
	        	post_url: "/api/bookmark/"+this.props.location.state.bookmark.id};
	    }
	    else
	    {
	    	this.state = this.state = {bookmark: {}, value: "", bookmark_tags: [], 
	    	work: this.props.location.state.work, post_url: "/api/bookmark/", title: ""};

	    }
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
  		if (this.state.has_errors && e.target.value != "") {
  			this.setState({
  				has_errors: false,
  				errors: [],
  				title: e.target.value 
  			})
  			return
  		}
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

  	componentDidMount()
	{
	    if (!this.props.user) {
	    	this.props.alert.show('You must be logged in to perform this action.', {
	            timeout: 6000,
	            type: 'info'
	        })
	        this.props.history.push({
	            pathname: '/'
	        })
	    }
	}

  	render() {
  		const AddOrUpdate = withRouter(({ history }) => (
	    <div> <button onMouseDown={evt => this.addBookmark(evt, history)} className="btn btn-default">Submit</button>
	    </div>
	    ))
	    return (
	    	<div>
	    		{this.state.has_errors && <div className="row">
	    			<ErrorList errors={this.state.errors}/>
	    		</div>}
	    		<div className="row">
	    			<div className="col-xs-1">Work:</div>
	    			<div className="col-xs-10">{this.state.work ? this.state.work.title : this.state.bookmark.work.title}</div>
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
					      	placeholder="Enter your review, description, or other curation notes here"
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
				                  <TagList tag_category={tag.label} tags={tag.tags} category_id={tag.id}
				                  underEdit={true} createWorkTags={this.create_bookmark_tag}/>
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

export default withAlert(withRouter(BookmarkForm))