import React from 'react';

export default class Notification extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, notification: this.props.notification};
    }

  render() {
    return (
      <tr>
        <td>
          {this.state.notification.content}
        </td>   
        <td>
          9/30/17 12:00 AM
        </td>                    
      </tr>
    );
  }

}