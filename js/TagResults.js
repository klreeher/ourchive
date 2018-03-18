import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import SearchResults from './SearchResults';
import ReactDOM from 'react-dom';


export default class TagResults extends React.Component {

	getData()
	{
	  axios.get('/api/tag/'+this.state.tag_id+'/'+this.state.tag_text)
	      .then(function (response) {
	        this.setState({	        	
	          works: response.data.works,
	          bookmarks: response.data.bookmarks,
	          results: true
	        });
	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
	}

	constructor(props) {
	    super(props);
	    this.state = {tag_id: props.match.params.tagId, tag_text: props.match.params.tagText};

	}

	getNextWorkPage() {

	}

	componentDidMount() { 

	this.getData();
	}

  render() {
    return (
    	<div className="container-fluid">
    		{this.state.results ? <SearchResults bookmarks={this.state.bookmarks} works={this.state.works}/> : <div/>}
    	</div>
      
    );
  }

}