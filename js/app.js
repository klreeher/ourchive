import { render } from 'react-dom';
import RootApp from './RootApp';
import React, { Component } from 'react';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

const options = {
  position: 'bottom center',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
}
	
class App extends Component  {
  render () {


  	return (
      <AlertProvider template={AlertTemplate}{...options}>
        <RootApp />
      </AlertProvider>
    )
  }
}

render(<App />, document.getElementById('reactEntry'))

