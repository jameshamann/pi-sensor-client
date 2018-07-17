import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './screens/home.js'
import '../node_modules/react-vis/dist/style.css';

class App extends Component {
  render() {
    return (
      <Home />
    );
  }
}

export default App;
