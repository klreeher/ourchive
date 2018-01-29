import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';

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
      <div>
        <div className="row">
          <div className="col-md-2">
            sort meeee
          </div>
          <div className="col-md-4 col-md-offset-8">
            sort meeee
          </div>
        </div>
        <div className="row">
    		    <div className="col-md-2">
    	        Message Type
    	       </div>	
            <div className="col-md-6">
              Message Type
            </div>   
            <div className="col-md-4">
              Message DateTime
            </div>         	
        </div>
      </div>
    );
  }

}