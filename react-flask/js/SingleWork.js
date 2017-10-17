import React from 'react';
import axios from 'axios';
import TagItem from './TagItem';

export default class SingleWork extends React.Component {

  setWork(work)
  {
    this.work = work;
  }

  getWork(workId)
  {
  axios.get('/api/work/'+workId)
      .then(function (response) {
        this.setState({work: response.data[0]["name"]});
        
      }.bind(this))
      .catch(function (error) {
        console.log(error);
    });
  }
  constructor(props) {
    super(props);
    this.state = {workId: props.match.params.workId, work: ''};
  }
  componentWillMount() { 
    this.getWork(this.state.workId); 
  }
  componentWillUpdate(nextProps, nextState)
  {
    //this.state.workId = nextProps.match.params.workId;
    //this.getWork(this.state.workId);
  }

  
  render() {
    return (
      <div>
        <h3>{this.state.workId}</h3>
        <p>{this.state.work}</p>
        <div>
          <TagItem/>
        </div>
      </div>
    );
  }
}