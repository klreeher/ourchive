import React from 'react';

export default class SingleWork extends React.Component {

  constructor(props) {
    super(props);
    this.workId = props.match.params.workId;
  }
  componentDidMount() {
    //do something here
  }
  componentWillUpdate(nextProps, nextState)
  {
    this.workId = nextProps.match.params.workId;
  }
  render() {
    return (
      <div>
        <h3>{this.workId}</h3>
      </div>
    );
  }
}