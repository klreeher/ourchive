import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import BookmarkItem from './BookmarkItem';
import ReactDOM from 'react-dom';


export default class BookmarkList extends React.Component {

	getBookmarks(curatorId)
	{
	  axios.get('/api/bookmark/curator/'+curatorId)
	      .then(function (response) {
	        this.setState({	        	
	          bookmarks: response.data.bookmarks,
	          curator: response.data.curator

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
	        console.log(error);
	    });
	}

	constructor(props) {
	    super(props);
	    this.state = {curatorId: props.match.params.curatorId, bookmarks: [], current_page: 0, curator: []};
    
    }

  componentWillMount() { 

    this.getBookmarks(this.state.curatorId); 
  }

  render() {
    return (
    	<div className="container-fluid">
    		<div className="row">
    			<div className="col-md-12"><h3>{this.state.curator.curator_name}'s bookmarks</h3></div>
    		</div>
	        {this.state.bookmarks.map(bookmark => 
	          <div key={bookmark.id} >
	            <BookmarkItem bookmark={bookmark} user={this.props.user} curator={this.state.curator} ref={"bookmark_"+bookmark.id}/>
	          </div>
	        )}
    	</div>
      
    );
  }

}