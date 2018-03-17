import React from 'react';
import axios from 'axios';
import BookmarkStub from './BookmarkStub';
import WorkStub from './WorkStub';
import {Tabs, Tab, Row, Nav, Col, NavItem} from 'react-bootstrap';

export default class SearchResults extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {results: this.props.results};
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
        </Tab.Container>
    );
  }

}