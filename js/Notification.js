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
    if (this.state.notification.type === "Comment")
    {
      history.push('/work/'+this.state.notification.workId);
    }
    else if (this.state.notification.type === "System Notification")
    {
      alert("system");
    }
  }

  
  render() {
    const History = withRouter(({ history }) => (
    <div> <button className="btn btn-link" onClick={evt => this.goToItem(evt, history)}>{this.state.notification.content}</button>
    </div>
    ))
    return (
      <tr>
        <td>
          <History/>
        </td>   
        <td>
          bleh
        </td>                    
      </tr>
      
    );
  }

}