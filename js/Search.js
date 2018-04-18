import React from 'react';
import axios from 'axios';
import BookmarkStub from './BookmarkStub';
import SearchResults from './SearchResults';
import WorkStub from './WorkStub';
import {Tabs, Tab, Row, Nav, Col, NavItem} from 'react-bootstrap';

export default class Search extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user,  searchTerm: "", advancedText: "Show Advanced Search", searchBookmarks: true,
      searchWorks: true};
      this.doSearch = this.doSearch.bind(this);
      this.toggleAdvanced = this.toggleAdvanced.bind(this);
    }

  doSearch(event)
  {
      event.target.blur()
      if (this.state.searchTerm === "") return;
      axios.get('/api/search/term/'+this.state.searchTerm)
        .then(function (response) {
          this.setState({           
            results: response.data

          });
        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  }  

  toggleAdvanced(event)
  {
      event.target.blur()
      if (this.state.advancedText === "Show Advanced Search")
      {
        this.setState({
          showAdvancedSearch: true,
          advancedText: "Hide Advanced Search"
        })
      }
      else
      {
        this.setState({
          showAdvancedSearch: false,
          advancedText: "Show Advanced Search"
        })
      }
  }  

  updateSearchTerm(event, key)
  {
    this.setState({
      searchTerm: event.target.value
    })
  }

  updateUserSearch(event, key)
  {
    console.log(event.target.value)
  }

  updateSearchWorks(event)
  {
    var oldVal = this.state.searchWorks;
    this.setState({
      searchWorks: !oldVal
    })
  }

  updateSearchBookmarks(event)
  {
    var oldVal = this.state.searchBookmarks;
    this.setState({
      searchBookmarks: !oldVal
    })
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-4 h3">Basic Search</div>
        </div>
		    <div className="row">
          <div className="col-md-6">
            <div className="input-group">
              <input className="form-control" value={this.state.searchTerm} onChange={evt => this.updateSearchTerm(evt)} placeholder="Find me something great!"></input>
              <span className="input-group-btn">
                <button className="btn btn-primary" type="button" onClick={this.doSearch}>Search</button>
              </span>
            </div>            
          </div>
          <div className="col-md-3">
              <button className="btn btn-link" type="button" onClick={this.toggleAdvanced}>{this.state.advancedText}</button>
            </div>
        </div>
        <br/>
        {this.state.showAdvancedSearch ?
          <div>
            <div className="row">
              <div className="col-sm-4 h3">Advanced Search</div>
            </div>
            <hr/>   
            <div className="row">
              <div className="col-sm-4 h3">Words</div>
            </div>         
            <div className="row text-padding">
              <div className="col-sm-4">Any of these words</div>
              <div className="col-sm-6">
                  <input id="searchTerm" type="text" className="form-control" onChange={evt => this.updateSearchTerm(evt, 1)} value={this.state.searchAny}/>
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-4">None of these words</div>
              <div className="col-sm-6">
                  <input id="excludeTerms" type="text" className="form-control" onChange={evt => this.updateSearchTerm(evt, 2)} value={this.state.searchNone}/>
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-4">Exactly matching</div>
              <div className="col-sm-6">
                  <input id="matchTerm" type="text" className="form-control" onChange={evt => this.updateSearchTerm(evt, 2)} value={this.state.searchMatch}/>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 h3">Users</div>
            </div>         
            <div className="row text-padding">
              <div className="col-sm-4">Curator username(s)</div>
              <div className="col-sm-6">
                  <input id="curatorUsernames" type="text" className="form-control" onChange={evt => this.updateUserSearch(evt, 1)} value={this.state.searchCurator}/> 
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-4">Creator username(s)</div>
              <div className="col-sm-6">
                  <input id="creatorUsernames" type="text" className="form-control" onChange={evt => this.updateUserSearch(evt, 2)} value={this.state.searchCreator}/> 
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 h3">Types</div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-3">
                  <input type="checkbox" id="searchWorks" onChange={evt => this.updateSearchWorks(evt)} checked={this.state.searchWorks}/>  Works
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-3">
                  <input type="checkbox" id="searchBookmarks" onChange={evt => this.updateSearchBookmarks(evt)} checked={this.state.searchBookmarks}/>  Bookmarks
              </div>
            </div>
            <br/>
            <div className="row text-padding">
              <div className="col-xs-1">
                <button className="btn btn-primary" type="button" onClick={this.doSearch}>Search</button>
              </div>
            </div>
            
          
          </div>

          : <div/>}
        <br/>
        <br/>       

        {this.state.results ? <SearchResults bookmarks={this.state.results.bookmarks} works={this.state.results.works} user={this.props.user}/> : <div/>}
      </div>
    );
  }

}