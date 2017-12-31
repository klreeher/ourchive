import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';

export default class EditDeleteButtons extends React.Component {

	

	constructor(props) {
	    super(props);
    
    }


  render() {
    return (
    	<div className="col-md-12">
			<div className={this.props.viewer_is_creator ? "viewer-creator row" : "viewer row"}>
		      <div className="col-xs-1">
		        <button>Edit</button>				            
		      </div>
		      <div className="col-xs-1">
		      	<button>Delete</button>
		      </div>
		   	</div>
	   	</div>
    );
  }

}