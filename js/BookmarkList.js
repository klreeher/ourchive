import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import BookmarkItem from './BookmarkItem';
import ReactDOM from 'react-dom';
import PaginationControl from './PaginationControl';
import { withAlert } from 'react-alert';


class BookmarkList extends React.Component {

	getBookmarks(curatorId)
	{
	  axios.get('/api/bookmark/curator/'+curatorId)
	      .then(function (response) {
	      	var curator = {}
	      	if (response.data.bookmarks.length > 0) {
	      		curator = response.data.bookmarks[0].curator
	      	}
	        this.setState({	        	
	          bookmarks: response.data.bookmarks,
	          curator: curator

	        }, () => {
	            var queryParams = new URLSearchParams(this.props.location.search);            
            	var commentId = queryParams.get('commentId');
            	var bookmarkId = queryParams.get('bookmarkId');
            	if (commentId != null)
            	{
            		var comment = "comment_"+commentId;
	                var bookmark = "bookmark_"+bookmarkId;
	                this.refs[bookmark].toggleComments(null, commentId);
            	}
                
             });
	      }.bind(this))
	      .catch(function (error) {
	        this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
        })
	    }.bind(this));
	}

	previousPage(name) {
       this.getBookmarkPage(this.state.bookmark_page - 1)
    }

  nextPage(name) {
       this.getBookmarkPage(this.state.bookmark_page + 1)
  }

  getBookmarkPage(page) {
    axios.get('/api/bookmark/curator/'+this.state.curator.curator_id+'/'+page)
        .then(function (response) {
          this.setState({           
            bookmarks: response.data.bookmarks,
            bookmark_page: page,
            bookmark_pages: response.data.pages
          });
        }.bind(this))
        .catch(function (error) {
          this.props.alert.show('An error has occurred. Contact your administrator if this persists.', {
            timeout: 6000,
            type: 'error'
        })
      }.bind(this));
  }

	constructor(props) {
	    super(props);
	    this.state = {curatorId: props.match.params.curatorId, bookmarks: [], current_page: 0, curator: [],
	    	bookmark_page: 1, bookmark_pages: 1};
    	this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.getBookmarkPage = this.getBookmarkPage.bind(this);
    }

  componentDidMount() { 

    this.getBookmarks(this.state.curatorId); 
  }

  render() {
    return (
    	<div className="container">
    		<div className="row">
    			<div className="col-md-12"><h3>{this.state.curator.curator_name}'s bookmarks</h3></div>
    		</div>
	        {this.state.bookmarks.map(bookmark => 
	          <div key={bookmark.id} >
	            <BookmarkItem bookmark={bookmark} user={this.props.user} curator={this.state.curator} ref={"bookmark_"+bookmark.id}/>
	          </div>
	        )}
	        <div className="row">
	        	{this.state.bookmarks.length > 0 && <PaginationControl paginationName="bookmark" previousPage={this.previousPage} nextPage={this.nextPage}
                      totalPages={this.state.bookmark_pages} currentPage={this.state.bookmark_page}/>}
            </div>
    	</div>
      
    );
  }
}

export default withAlert(BookmarkList)