import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './screens/home.js'
import '../node_modules/react-vis/dist/style.css';
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <Home />
    );
  }
}

export default (App);
