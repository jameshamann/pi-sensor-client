import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';


class Home extends Component {
  render() {
    return (
    <MuiThemeProvider>
      <AppBar
         title="Dashboard"
         iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <RaisedButton label="Hello World!" />

    </MuiThemeProvider>

    );
  }
}

export default Home;
