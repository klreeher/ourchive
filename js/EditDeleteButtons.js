import React from 'react';
import {
  DropdownButton,
  ButtonToolbar,
  MenuItem
} from 'react-bootstrap';

export default class EditDeleteButtons extends React.Component {
	constructor(props) {
	  super(props);
	}
	render() {
		return (
			<DropdownButton title={this.props.dropdownLabel} id="dropdown-size-medium" bsStyle="default">
				{this.props.actions.map(action => 
					<MenuItem onClick={evt => action.actionToDo(evt, ...action.variables)}>{action.actionText}</MenuItem>
	        	)}
			 </DropdownButton>
		);
	}
}