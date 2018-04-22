import React from 'react';
import axios from 'axios';
import BookmarkStub from './BookmarkStub';
import SearchResults from './SearchResults';
import WorkStub from './WorkStub';
import WorkTypeCheckbox from './WorkTypeCheckbox';
import {Tabs, Tab, Row, Nav, Col, NavItem} from 'react-bootstrap';

export default class Search extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user,  searchTerm: "", advancedText: "Show Advanced Search", searchBookmarks: true,
      searchWorks: true, work_types: [], searchCurator: "", searchCreator: "", 
      bookmark_page: 1, work_page: 1};
      this.doSearch = this.doSearch.bind(this);
      this.searchType = this.searchType.bind(this);
      this.toggleAdvanced = this.toggleAdvanced.bind(this);
      this.doAdvancedSearch = this.doAdvancedSearch.bind(this);
      this.previousPage = this.previousPage.bind(this);
      this.nextPage = this.nextPage.bind(this);
    }

  componentDidMount()
  {
    axios.get('/api/works/types')
        .then(function (response) {
          this.setState({work_types: response.data});  

        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  }

  doSearch(event)
  {
      event.target.blur()
      if (this.state.searchTerm === "") return;
      axios.post('/api/search/term/'+this.state.searchTerm, {"search_works": this.state.searchWorks,
        "search_bookmarks": this.state.searchBookmarks})
        .then(function (response) {
          this.setState({           
            works: response.data.works,
            results: true,
            bookmarks: response.data.bookmarks
          });
        }.bind(this))
        .catch(function (error) {
          console.log(error);
      });
  } 

  doAdvancedSearch(event)
  {
    event.target.blur()
    axios.post('/api/search/advanced', {"search_works": this.state.searchWorks,
        "search_bookmarks": this.state.searchBookmarks, "include_terms": this.state.searchAny,
        "exclude_terms": this.state.searchNone, "curator_usernames": this.state.searchCurator,
        "creator_usernames": this.state.searchCreator})
        .then(function (response) {
          this.setState({           
            works: response.data.works,
            results: true,
            bookmarks: response.data.bookmarks
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

  updateSearchTerm(event)
  {
    this.setState({
      searchTerm: event.target.value
    })
  }

  updateCuratorSearch(event)
  {
    this.setState({
      searchCurator: event.target.value
    })
  }

  updateCreatorSearch(event)
  {
    this.setState({
      searchCreator: event.target.value
    })
  }

  updateAnyTerms(evt)
  {
    this.setState({
      searchAny: event.target.value
    })
  }

  updateNoneTerms(evt) 
  {
    this.setState({
      searchNone: event.target.value
    })
  }

  updateExactlyTerms(evt)
  {
    console.log(event.target.value)
  }

  updateAnyTags(evt) 
  {
    console.log(event.target.value)
  }

  updateNoneTags(evt)
  {
    console.log(event.target.value)
  }

  updateExactlyTags(evt)
  {
    console.log(event.target.value)
  }

  searchType(type_id)
  {
    console.log(type_id)
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
    console.log("not implemented")
  }

  getBookmarkPage(page) {
    console.log("not implemented")
  }

  render() {
    return (
      <div>

        { !this.state.showAdvancedSearch  && <div>
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
          </div></div></div>}
        <div className="row">
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
                  <input id="searchTerm" type="text" className="form-control" onChange={evt => this.updateAnyTerms(evt)} value={this.state.searchAny}/>
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-4">None of these words</div>
              <div className="col-sm-6">
                  <input id="excludeTerms" type="text" className="form-control" onChange={evt => this.updateNoneTerms(evt)} value={this.state.searchNone}/>
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-4">Exactly matching</div>
              <div className="col-sm-6">
                  <input id="matchTerm" type="text" className="form-control" onChange={evt => this.updateExactlyTerms(evt)} value={this.state.searchExactly}/>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 h3">Users</div>
            </div>         
            <div className="row text-padding">
              <div className="col-sm-4">Curator username(s)</div>
              <div className="col-sm-6">
                  <input id="curatorUsernames" type="text" className="form-control" onChange={evt => this.updateCuratorSearch(evt)} value={this.state.searchCurator}/> 
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-4">Creator username(s)</div>
              <div className="col-sm-6">
                  <input id="creatorUsernames" type="text" className="form-control" onChange={evt => this.updateCreatorSearch(evt)} value={this.state.searchCreator}/> 
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 h3">Tags</div>
            </div>         
            <div className="row text-padding">
              <div className="col-sm-4">Any of these tags</div>
              <div className="col-sm-6">
                  <input id="anyTags" type="text" className="form-control" onChange={evt => this.updateAnyTags(evt)} value={this.state.searchAnyTags}/> 
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-4">None of these tags</div>
              <div className="col-sm-6">
                  <input id="noneTags" type="text" className="form-control" onChange={evt => this.updateNoneTags(evt)} value={this.state.searchExactlyTags}/> 
              </div>
            </div>
            <div className="row text-padding">
              <div className="col-sm-4">Exactly these tags</div>
              <div className="col-sm-6">
                  <input id="exactlyTags" type="text" className="form-control" onChange={evt => this.updateExactlyTags(evt)} value={this.state.searchNoneTags}/> 
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
            {this.state.work_types.map(type => 
              <div className="row text-padding" key={type.id}>
                <WorkTypeCheckbox type={type} searchType={this.searchType}/>
              </div>
            )}
           
            <div className="row text-padding">
              <div className="col-sm-3">
                  <input type="checkbox" id="searchBookmarks" onChange={evt => this.updateSearchBookmarks(evt)} checked={this.state.searchBookmarks}/>  Bookmarks
              </div>
            </div>
            <br/>
            <div className="row text-padding">
              <div className="col-xs-1">
                <button className="btn btn-primary" type="button" onClick={this.doAdvancedSearch}>Search</button>
              </div>
            </div>
            
          
          </div>

          : <div/>}
        <br/>
        <br/>       

        {this.state.results ? <SearchResults bookmarks={this.state.bookmarks} 
        works={this.state.works} user={this.props.user} previousPage={this.previousPage} 
        nextPage={this.nextPage} totalWorkPages={this.state.work_pages}
        currentWorkPage={this.state.work_page} totalBookmarkPages={this.state.bookmark_pages}
        currentBookmarkPage={this.state.bookmark_page}/> : <div/>}
      </div>
    );
  }

}