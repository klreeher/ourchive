import React from 'react';
import { withRouter } from 'react-router-dom';



export default class Notification extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, notification: this.props.notification};
    }



  goToItem(evt, history)
  {
    evt.target.blur();
    if (this.state.notification.type === "Work")
    {
      
      history.push({
        pathname: '/work/'+this.state.notification.workId,
        search: '?chapterId='+this.state.notification.chapterId+'&commentId='+this.state.notification.commentId
      })
    }
    else if (this.state.notification.type === "System Notification")
    {
      alert("system");
    }
    else if (this.state.notification.type === "Bookmark")
    {
      history.push({
        pathname: '/bookmark/'+this.state.notification.bookmarkId,
        search: '?commentId='+this.state.notification.commentId+'&bookmarkId='+this.state.notification.bookmarkId
      })
    }
  }

  deleteItem(evt)
  {
    evt.target.blur();
    this.props.deleteNotification(this.state.notification);
  }

  
  render() {
    const History = withRouter(({ history }) => (
    <div> <button className="btn btn-link" onClick={evt => this.goToItem(evt, history)}>{this.state.notification.content}</button>
    </div>
    ))
    return (
      <tr>
        <td className="col-sm-8">
          <History/>
        </td>   
        <td className="col-sm-2">
          bleh
        </td>  
        <td className="col-sm-2">
          <button className="btn btn-link" onClick={evt => this.deleteItem(evt)}>Delete</button>
        </td>                  
      </tr>
      
    );
  }

}