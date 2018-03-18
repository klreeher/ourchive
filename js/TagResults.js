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
	    this.state = {tag_id: props.match.params.tagId, tag_text: props.match.params.tagText, 
	    	bookmark_page: 1, work_page: 1};
	    this.previousPage = this.previousPage.bind(this)
	    this.nextPage = this.nextPage.bind(this)
	    this.getWorkPage = this.getWorkPage.bind(this)
	    this.getBookmarkPage = this.getBookmarkPage.bind(this)
	}

	
  previousPage(evt) {
  	evt.preventDefault()
    switch (evt.target.name) {
    	case "work":
    		this.getWorkPage(this.state.work_page - 1)
    		break
    	case "bookmark":
    		this.getBookmarkPage(this.state.bookmark_page - 1)
    		break
    }
  }

  nextPage(evt) {
  	evt.preventDefault()
    switch (evt.target.name) {
    	case "work":
    		this.getWorkPage(this.state.work_page + 1)
    		break
    	case "bookmark":
    		this.getBookmarkPage(this.state.bookmark_page + 1)
    		break
    }
  }

  getWorkPage(page) {  	
  	axios.get('/api/tag/work/'+this.state.tag_id+'/'+this.state.tag_text+'/'+page)
	      .then(function (response) {
	        this.setState({	        	
	          works: response.data.works,
	          work_page: page
	        });
	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    	});
  }

  getBookmarkPage(page) {
  	axios.get('/api/tag/bookmark/'+this.state.tag_id+'/'+this.state.tag_text)
	      .then(function (response) {
	        this.setState({	        	
	          bookmarks: response.data.works,
	          bookmark_page: page
	        });
	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    	});
  }

	componentDidMount() { 

	this.getData();
	}

  render() {
    return (
    	<div className="container-fluid">
    		{this.state.results ? <SearchResults bookmarks={this.state.bookmarks} works={this.state.works}
    		previousPage={this.previousPage} nextPage={this.nextPage}/> : <div/>}
    	</div>
      
    );
  }

}