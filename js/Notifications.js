import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab, DropdownButton, MenuItem} from 'react-bootstrap';

export default class Notifications extends React.Component {

	

	constructor(props) {
	    super(props);
	    this.state = {user: this.props.user, notification: this.props.notification};
      this.goToItem = this.goToItem.bind(this);
    }

  
  goToItem(event)
  {
    event.target.blur()
    
  }
  render() {
    return (
      <div className="container-fluid text-padding">
        <div className="row">
          <div className="col-xs-3">

            <DropdownButton
              bsStyle="default"
              title="Filter notifications by..."
              key={1}
              id={`dropdown-basic-${1}`}
              >
              <MenuItem eventKey="1">Comment</MenuItem>
              <MenuItem eventKey="2">System Notification</MenuItem>
              <MenuItem eventKey="2">All</MenuItem>              
            </DropdownButton>            
          </div>
        </div>
        <br/>
        <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th key="Content">Content</th>
              <th key="Time">Time</th> 
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                New comment on [title] from [user]: blah blah blah blah blah blah...
              </td>   
              <td>
                9/30/17 12:00 AM
              </td>                    
            </tr>
            <tr>
              <td>
                An update to your bookmark subscription x has occurred...
              </td>   
              <td>
                1/30/18 3:00 PM
              </td> 
            </tr>
          </tbody>          
        </table>  
        </div>      
      </div>
    );
  }

}