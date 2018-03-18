import React from 'react';
import ReactDOM from 'react-dom';


export default class PaginationControl extends React.Component {

	constructor(props) {
	    super(props);
	    this.doNextPage = this.doNextPage.bind(this)
	    this.doPreviousPage = this.doPreviousPage.bind(this)
	    var noNext = this.props.totalPages <= 1
	    this.state = {previousDisabled: true, nextDisabled: noNext}
	}

	doNextPage(evt) {
		evt.preventDefault()
		var disableNext = this.props.totalPages <= this.props.currentPage + 1
		this.setState({
			nextDisabled: disableNext,
			previousDisabled: false
		})
		this.props.nextPage(this.props.paginationName)
	}

	doPreviousPage(evt) {
		evt.preventDefault()
		var disablePrevious = this.props.currentPage - 1 === 1
		this.setState({
			previousDisabled: disablePrevious,
			nextDisabled: false
		})
		this.props.previousPage(this.props.paginationName)
	}

  render() {
    return (
    	<div className="row">
            <button className="btn btn-link" name={this.props.paginationName} 
            	onMouseDown={this.doPreviousPage} disabled={this.state.previousDisabled}>Previous Page</button>
            <button className="btn btn-link" name={this.props.paginationName} 
            	onMouseDown={this.doNextPage} disabled={this.state.nextDisabled}>Next Page</button>
        </div>
      
    );
  }

}