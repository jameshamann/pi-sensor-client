import React, { Component } from 'react';
import './App.css';
import Home from './screens/home.js'
import '../node_modules/react-vis/dist/style.css';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
Amplify.configure(awsmobile);

class App extends Component {
  render() {
    return (
      <Home userData={this.props.authData} />
    );
  }
}

export default (App);
