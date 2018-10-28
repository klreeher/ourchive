import React from 'react';
import axios from 'axios';
import BookmarkStub from './BookmarkStub';
import WorkStub from './WorkStub';
import PaginationControl from './PaginationControl';
import {Tabs, Tab, Row, Nav, Col, NavItem} from 'react-bootstrap';

export default class SearchResults extends React.Component {

	

	constructor(props) {
	    super(props);
      this.state = this.props.history.location.state;
      this.previousPage = this.previousPage.bind(this);
      this.nextPage = this.nextPage.bind(this);
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
    if (this.state.showAdvancedSearch)
    {
      axios.post('/api/search/advanced/page/'+ page, {"search_works": true,
        "search_bookmarks": false, "include_terms": this.state.searchAny,
        "exclude_terms": this.state.searchNone, "curator_usernames": this.state.searchCurator,
        "creator_usernames": this.state.searchCreator, "work_types": this.state.search_types})
        .then(function (response) {
          this.setState({           
            works: response.data.works,
            work_page: page,
            work_pages: response.data.work_pages
          });
        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
      }.bind(this));
    }
    else
    {
      axios.post('/api/search/term/'+this.state.searchTerm+'/page/'+page, {"search_works": true,
        "search_bookmarks": false})
        .then(function (response) {
          this.setState({           
            works: response.data.works,
            work_page: page,
            work_pages: response.data.work_pages
          });
        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
        }.bind(this));
    }
    
  }

  getBookmarkPage(page) {
    if (this.state.showAdvancedSearch) 
    {
      axios.post('/api/search/advanced/page/'+page, {"search_works": false,
        "search_bookmarks": true, "include_terms": this.state.searchAny,
        "exclude_terms": this.state.searchNone, "curator_usernames": this.state.searchCurator,
        "creator_usernames": this.state.searchCreator})
        .then(function (response) {
          this.setState({           
            bookmark_pages: response.data.bookmark_pages,
            bookmark_page: 1,
            bookmarks: response.data.bookmarks
          });
        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
        }.bind(this));
    }
    else
    {
      axios.post('/api/search/term/'+this.state.searchTerm+'/page/'+page, {"search_works": false,
        "search_bookmarks": true})
        .then(function (response) {
          this.setState({           
            bookmarks: response.data.bookmarks,
            bookmark_page: page,
            bookmark_pages: response.data.bookmark_pages
          });
        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
          })
        }.bind(this));
    }
    
  }


  render() {
    return ( 

        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
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
                  {this.state.bookmarks != null ? <div className="row">
                  <div className="row">
                    <div className="col-md-12">
                      {this.state.bookmarks.map(bookmark => 
                        <div key={bookmark.id} >
                          <BookmarkStub bookmark={bookmark} user={this.state.user} curator={bookmark.curator} ref={"bookmark_"+bookmark.id}/>
                        </div>
                      )}
                    </div>
                   </div>
                  <PaginationControl paginationName="bookmark" previousPage={this.previousPage} nextPage={this.nextPage}
                    totalPages={this.state.bookmark_pages} currentPage={this.state.bookmark_page}/>
                </div> : <div/>}
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  {this.state.works != null ? <div className="row">
                  <div className="row">
                    <div className="col-md-12">
                      {this.state.works.map(work => 
                        <div key={work.key} >
                          <WorkStub work={work}/>
                        </div>

                      )}
                    </div>
                  </div>
                    <PaginationControl paginationName="work" previousPage={this.previousPage} nextPage={this.nextPage}
                      totalPages={this.state.work_pages} currentPage={this.state.work_page}/>
                  </div> : <div/>}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
    );
  }

}