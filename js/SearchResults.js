import React from 'react';
import axios from 'axios';
import BookmarkStub from './BookmarkStub';
import WorkStub from './WorkStub';
import PaginationControl from './PaginationControl';
import {Tabs, Tab, Row, Nav, Col, NavItem} from 'react-bootstrap';

export default class SearchResults extends React.Component {

	

	constructor(props) {
	    super(props);
      this.state = {}
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
                  {this.props.bookmarks != null ? <div className="row">
                  <div className="row">
                    {this.props.bookmarks.map(bookmark => 
                      <div key={bookmark.id} >
                        <BookmarkStub bookmark={bookmark} user={this.props.user} curator={bookmark.curator} ref={"bookmark_"+bookmark.id}/>
                      </div>
                    )}
                    </div>
                    <PaginationControl paginationName="bookmark" previousPage={this.props.previousPage} nextPage={this.props.nextPage}
                      totalPages={this.props.totalBookmarkPages} currentPage={this.props.currentBookmarkPage}/>
                  </div> : <div/>}
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  {this.props.works != null ? <div className="row">
                  <div className="row">
                    {this.props.works.map(work => 
                      <div key={work.key} >
                        <WorkStub work={work}/>
                      </div>

                    )}
                    </div>
                    <PaginationControl paginationName="work" previousPage={this.props.previousPage} nextPage={this.props.nextPage}
                      totalPages={this.props.totalWorkPages} currentPage={this.props.currentWorkPage}/>
                  </div> : <div/>}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
    );
  }

}