import React, { Component } from 'react';
import { PropTypes } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Amplify, { API, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import _ from 'lodash'
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis} from 'react-vis';
import CircularProgress from '@material-ui/core/CircularProgress';
import WeatherForecast from '../components/weatherForecast'
import PiSensor from '../components/piSensorLiveData'
import Watering from '../components/watering'
import CropTable from '../components/cropTable'

const uuidv1 = require('uuid/v1');


class Home extends Component {

  constructor(props){
    super(props)
    this.state = {currWeather: ''}
    this.nowWeather = this.nowWeather.bind(this);

  }

  nowWeather = (currWeather) => {
    this.setState({currWeather: currWeather})

  }

  componentDidMount(){
    this.nowWeather()
  }

  render() {
    console.log(this.state.currWeather)
    return (
    <MuiThemeProvider>
      <AppBar
         title="Raspberry Pi Weather Dashboard"
         iconClassNameRight="muidocs-icon-navigation-expand-more"
         style={{ backgroundColor: '#039be5' }}
      />
      <br />
      <br />
      <div>
        <Grid container spacing={24}>
          <Grid item xs={1} sm={2}>
          </Grid>
          <Grid item xs={1} sm={3}>
            <PiSensor currWeather={this.state.currWeather} showFiveDayForecast={this.showForecast}/>
          </Grid>
          <Grid item xs={1} sm={6}>
            <WeatherForecast getWeather={this.nowWeather} />
           </Grid>
         <Grid item xs={1} sm={2}>
         </Grid>
         <Grid item xs={1} sm={3}>
           <Watering currWeather={this.state.currWeather} />
         </Grid>
         <Grid item xs={1} sm={6}>
             <CropTable />
         </Grid>
     </Grid>
     </div>
    </MuiThemeProvider>

    );
  }
}

export default Home;
