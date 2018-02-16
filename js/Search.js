import React from 'react';
import axios from 'axios';

export default class Search extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, results: [], searchTerm: ""};
      this.doSearch = this.doSearch.bind(this);
    }

  doSearch(event)
  {
      event.target.blur()
      console.log(this.state.searchTerm);  
  }  

  updateSearchTerm(event)
  {
    this.setState({
      searchTerm: event.target.value
    })
  }

  render() {
    return (
      <div className="container">
		    <div className="row">
          <div className="col-md-6">
            <div className="input-group">
              <input className="form-control" value={this.state.searchTerm} onChange={evt => this.updateSearchTerm(evt)} placeholder="Search..."></input>
              <span className="input-group-btn">
                <button className="btn btn-default" type="button" onClick={this.doSearch}>Search</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

}