import React from 'react';
import axios from 'axios';
import BookmarkStub from './BookmarkStub';
import WorkStub from './WorkStub';
import {Tabs, Tab, Row, Nav, Col, NavItem} from 'react-bootstrap';

export default class Search extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user,  searchTerm: "", advancedText: "Show Advanced Search"};
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

  updateSearchTerm(event)
  {
    this.setState({
      searchTerm: event.target.value
    })
  }

  updateSearchType(event, key)
  {
    console.log(key)
  }

  updateWorkFields(event, key)
  {
    console.log(key)
  }

  updateBookmarkFields(event, key)
  {
    console.log(key)
  }

  updateSearchWorks(event)
  {
    console.log(event.target.value)
  }

  updateSearchBookmarks(event)
  {
    console.log(event.target.value)
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
          <div className="col-md-3">
              <button className="btn btn-link" type="button" onClick={this.toggleAdvanced}>{this.state.advancedText}</button>
            </div>
        </div>
        <br/>
        {this.state.showAdvancedSearch ?
          <div>
            <div className="panel panel-default">
              <div className="panel-heading">General Search</div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-sm-2">
                      <input type="checkbox" id="searchTypeOne" onChange={evt => this.updateSearchType(evt, 1)}/>  Search work type 1?
                    </div>
                    <div className="col-sm-2">
                      <input type="checkbox" id="searchTypeTwo" onChange={evt => this.updateSearchType(evt, 2)}/>  Search work type 2?
                    </div>
                    <div className="col-sm-2">
                      <input type="checkbox" id="searchTypeThree" onChange={evt => this.updateSearchType(evt, 3)}/>  Search work type 3?
                    </div>
                    <div className="col-sm-2">
                        <input type="checkbox" id="searchWorks" onChange={evt => this.updateSearchWorks(evt)}/>  Search works?
                    </div>
                    <div className="col-sm-4">
                      <input type="checkbox" id="searchBookmarks" onChange={evt => this.updateSearchBookmarks(evt)}/>  Search bookmarks?
                    </div>          
                  </div>
              </div>
            </div>
            

            <div className="panel panel-default">
              <div className="panel-heading">Work Search</div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-sm-2">   
                      <input type="checkbox" id="searchTitle" onChange={evt => this.updateWorkFields(evt, 1)} checked={this.state.searchTitle}/>  Search title? 
                    </div>
                    <div className="col-sm-2">  
                      <input type="checkbox" id="searchCreator" onChange={evt => this.updateWorkFields(evt, 2)} checked={this.state.searchCreator}/>  Search creator?
                    </div>                    
                    <div className="col-sm-2">  
                      <input type="checkbox" id="searchTags" onChange={evt => this.updateWorkFields(evt, 4)} checked={this.state.searchTags}/>  Search tags?
                    </div>
                    <div className="col-sm-2"> 
                      <input type="checkbox" id="searchText" onChange={evt => this.updateWorkFields(evt, 5)} checked={this.state.searchText}/>  Search text?
                    </div>   
                    <div className="col-sm-4">  
                      <input type="checkbox" id="searchSummary" onChange={evt => this.updateWorkFields(evt, 3)} checked={this.state.searchSummary}/>  Search summary?
                    </div>           
                  </div>
                </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">Bookmark Search</div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-sm-2">
                        <input type="checkbox" id="searchTitle" onChange={evt => this.updateBookmarkFields(evt, 1)} checked={this.state.searchTitle}/>  Search title?
                    </div>
                    <div className="col-sm-3">
                        <input type="checkbox" id="searchCreator" onChange={evt => this.updateBookmarkFields(evt, 2)} checked={this.state.searchCreator}/>  Search creator?
                    </div>
                    <div className="col-sm-3">
                        <input type="checkbox" id="searchCurator" onChange={evt => this.updateBookmarkFields(evt, 3)} checked={this.state.searchCurator}/>  Search curator?
                    </div>
                    <div className="col-sm-4">
                        <input type="checkbox" id="searchSummary" onChange={evt => this.updateBookmarkFields(evt, 4)} checked={this.state.searchSummary}/>  Search summary?
                    </div>                    
                  </div>
                  <div className="row">                      
                    <div className="col-sm-2">
                        <input type="checkbox" id="searchTags" onChange={evt => this.updateBookmarkFields(evt, 6)} checked={this.state.searchTags}/>  Search tags?
                    </div>
                    <div className="col-sm-2">
                      <input type="checkbox" id="searchRating" onChange={evt => this.updateBookmarkFields(evt, 7)} checked={this.state.searchRating}/>  Search rating?
                    </div>
                    <div className="col-sm-4">
                      <input type="checkbox" id="searchDescription" onChange={evt => this.updateBookmarkFields(evt, 5)} checked={this.state.searchDescription}/>  Search description?
                    </div>
                  </div>
                </div>
            </div>
            
            
          </div>

          : <div/>}
        <br/>
        <br/>       

        {this.state.results ? <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">
            <Col sm={2}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="first">Bookmarks</NavItem>
                <NavItem eventKey="second">Works</NavItem>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content animation>
                <Tab.Pane eventKey="first">
                  {this.state.results.bookmarks != null ? <div className="row">
                    {this.state.results.bookmarks.map(bookmark => 
                      <div key={bookmark.id} >
                        <BookmarkStub bookmark={bookmark} user={this.props.user} curator={bookmark.curator} ref={"bookmark_"+bookmark.id}/>
                      </div>
                    )}
                  </div> : <div/>}
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  {this.state.results.works != null ? <div className="row">
                    {this.state.results.works.map(work => 
                      <div key={work.key} >
                        <WorkStub work={work}/>
                      </div>
                    )}
                  </div> : <div/>}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container> : <div/>}
      </div>
    );
  }

}