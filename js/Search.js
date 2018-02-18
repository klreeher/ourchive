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
            <div className="row">
              <div className="col-md-4">
                work type toggles
              </div>
              <div className="col-md-4">
                work/bookmark toggles
              </div>            
            </div>
            <div className="row">
              <div className="col-md-6">
                work field to search toggles - title, creator, summary, tags, text
              </div>
              <div className="col-md-6">
                bookmark field to search toggles - title, creator, curator, work summary, curator description, tags, curator rating
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