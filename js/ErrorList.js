import React from 'react';

class ErrorList extends React.Component {

	constructor(props) {
	    super(props);
	}

	render() {
	    return (
	    	<div className="error-box">
		    	<div className="row">
		    		<div className="col-xs-6">
		    			<strong>Errors dected. Please correct before continuing.</strong>
		    		</div>
		    	</div>
		    	<div className="row">
			    	<ul>
			    		{this.props.errors.map(error => 
				              <div key={error}>
				                  <li>{error}</li>
				              </div>
				          )}
			    	</ul>
			    </div>
	    	</div>
	    );
  }
}

export default ErrorList;