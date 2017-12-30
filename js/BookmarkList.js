import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import BookmarkItem from './BookmarkItem';


export default class BookmarkList extends React.Component {

	getBookmarks(curatorId)
	{
	  axios.get('/api/bookmark/curator/'+curatorId)
	      .then(function (response) {
	        this.setState({	        	
	          bookmarks: response.data[0]["bookmarks"]

	        });
	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
	}

	constructor(props) {
	    super(props);
	    this.state = {curatorId: props.match.params.curatorId, bookmarks: [], current_page: 0};
    
    }

  componentWillMount() { 

    this.getBookmarks(this.state.curatorId); 
  }

  render() {
    return (
      <div className="list">
        {this.state.bookmarks.map(bookmark => 
          <div key={bookmark.key}>
            <BookmarkItem bookmark={bookmark}/>
          </div>
        )}
      </div>
    );
  }

}