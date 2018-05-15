import React from 'react';

export default class EditDeleteButtons extends React.Component {

	

	constructor(props) {
	    super(props);

	}


  render() {
    return (
    	<div>
			<div className={this.props.viewer_is_creator ? "viewer-creator row pull-right" : "viewer row pull-right"}>
		      <div className="col-xs-12">
		        <button onClick={this.props.editAction} className="btn btn-link">Edit</button> | <button onClick={this.props.deleteAction} className="btn btn-link">Delete</button>		            
		      </div>
		   	</div>
	   	</div>
    );
  }

}