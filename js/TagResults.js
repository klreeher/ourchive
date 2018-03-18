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
	          results: true,
	          work_pages: response.data.work_pages,
	          bookmark_pages: response.data.bookmark_pages
	        });
	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
	}

	constructor(props) {
	    super(props);
	    this.state = {tag_id: props.match.params.tagId, tag_text: props.match.params.tagText, 
	    	bookmark_page: 1, work_page: 1, previousWorkDisabled: true, previousBookmarkDisabled: true};
	    this.previousPage = this.previousPage.bind(this)
	    this.nextPage = this.nextPage.bind(this)
	    this.getWorkPage = this.getWorkPage.bind(this)
	    this.getBookmarkPage = this.getBookmarkPage.bind(this)
	}

	
  previousPage(name) {
    switch (name) {
    	case "work":
    		this.getWorkPage(this.state.work_page - 1)
    		break
    	case "bookmark":
    		this.getBookmarkPage(this.state.bookmark_page - 1)
    		break
    }
  }

  nextPage(name) {
    switch (name) {
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
	          work_page: page,
	          work_pages: response.data.work_pages
	        });
	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    	});
  }

  getBookmarkPage(page) {
  	axios.get('/api/tag/bookmark/'+this.state.tag_id+'/'+this.state.tag_text+'/'+page)
	      .then(function (response) {
	        this.setState({	        	
	          bookmarks: response.data.bookmarks,
	          bookmark_page: page,
	          bookmark_pages: response.data.bookmark_pages
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
    		previousPage={this.previousPage} nextPage={this.nextPage} totalWorkPages={this.state.work_pages}
    		currentWorkPage={this.state.work_page} totalBookmarkPages={this.state.bookmark_pages}
    		currentBookmarkPage={this.state.bookmark_page}/> : <div/>}
    	</div>
      
    );
  }

}