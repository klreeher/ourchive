import React from 'react';

export default class WorkTypeCheckbox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (			
          <div className="col-sm-3 col-sm-offset-1">
              {this.props.type && <div><input type="checkbox" id={"searchType"+this.props.type.id} onChange={this.props.searchType(this.props.type.id)}/>  {this.props.type.type_name} </div>}
          </div>
		);
	}

}