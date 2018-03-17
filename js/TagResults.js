import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import SearchResults from './SearchResults';
import ReactDOM from 'react-dom';


export default class TagResults extends React.Component {

	getData()
	{
	  axios.get('/api/tag/'+this.state.tag_id)
	      .then(function (response) {
	        this.setState({	        	
	          results: response.data
	        });
	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
	}

	constructor(props) {
	    super(props);
	    this.state = {tag_id: props.match.params.tagId, current_page: 0};
    
    }

  componentDidMount() { 

    this.getData();
  }

  render() {
    return (
    	<div className="container-fluid">
    		{this.state.results ? <SearchResults results={this.state.results}/> : <div/>}
    	</div>
      
    );
  }

}