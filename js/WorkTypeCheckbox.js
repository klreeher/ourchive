import React from 'react';

export default class WorkTypeCheckbox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (			
          <div className="col-sm-3 col-sm-offset-3">
              <input type="checkbox" id={"searchType"+this.props.type.id} onChange={this.props.searchType(type.id)} checked={this.props.type.checked}/>  {this.props.type.name}
          </div>
		);
	}

}