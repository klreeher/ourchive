import React from 'react';
import ReactDOM from 'react-dom';


export default class PaginationControl extends React.Component {

	constructor(props) {
	    super(props);
	    this.doNextPage = this.doNextPage.bind(this)
	    this.doPreviousPage = this.doPreviousPage.bind(this)
	    this.state = {previousDisabled: true, nextDisabled: false}
	}

	doNextPage(evt) {
		evt.preventDefault()
		var disableNext = this.props.totalPages <= this.props.currentPage + 1
		var disablePrevious = this.props.currentPage - 1 === 1
		this.setState({
			nextDisabled: disableNext,
			previousDisabled: disablePrevious
		})
		this.props.nextPage(this.props.paginationName)
	}

	doPreviousPage(evt) {
		evt.preventDefault()
		var disableNext = this.props.totalPages <= this.props.currentPage + 1
		var disablePrevious = this.props.currentPage - 1 === 1
		this.setState({
			previousDisabled: disablePrevious,
			nextDisabled: disableNext
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