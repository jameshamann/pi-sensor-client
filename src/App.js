import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

class App extends Component {
  render() {
    return (
    <MuiThemeProvider>
      <RaisedButton label="Hello World!" />
    </MuiThemeProvider>

    );
  }
}

export default App;
