import React, { Component } from 'react';
import { PropTypes } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Amplify, { API, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import _ from 'lodash'
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis} from 'react-vis';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import moment from 'moment'
import Grow from '@material-ui/core/Grow';
const uuidv1 = require('uuid/v1');


class WeatherForecast extends Component {

  constructor(props){
    super(props);
    this.success = this.success.bind(this)
    this.state = {
      geolat: '', geolong: '', currWeather: '', oneDayWeather: '', twoDayWeather: '',
      threeDayWeather: '', fourDayWeather: '', fiveDayWeather: '', sixDayWeather: '', sevenDayWeather: '', checked: false
    }
  }


  success(pos){
  var self = this;
  this.setState({
    geolat: pos.coords.latitude,
    geolong: pos.coords.longitude
  });
  fetch('https://api.apixu.com/v1/forecast.json?key=f01f15ee25ab4951abb154119182507&q=' + this.state.geolat + "," + this.state.geolong + '&days=5')
  .then(function(weather) {
    return weather.json()
  }).then(function(weather) {
    self.props.getWeather(weather.current)
    self.setFinishLoading()
    self.setState({
        oneDayWeatherIcon: weather.forecast.forecastday[0].day.condition.icon,
        twoDayWeatherIcon: weather.forecast.forecastday[1].day.condition.icon,
        threeDayWeatherIcon: weather.forecast.forecastday[2].day.condition.icon,
        fourDayWeatherIcon: weather.forecast.forecastday[3].day.condition.icon,
        fiveDayWeatherIcon: weather.forecast.forecastday[4].day.condition.icon,
        oneDayWeatherText: weather.forecast.forecastday[0].day.condition.text,
        twoDayWeatherText: weather.forecast.forecastday[1].day.condition.text,
        threeDayWeatherText: weather.forecast.forecastday[2].day.condition.text,
        fourDayWeatherText: weather.forecast.forecastday[3].day.condition.text,
        fiveDayWeatherText: weather.forecast.forecastday[4].day.condition.text,
        oneDayWeatherAveTemp: weather.forecast.forecastday[0].day.maxtemp_c,
        twoDayWeatherAveTemp: weather.forecast.forecastday[1].day.maxtemp_c,
        threeDayWeatherAveTemp: weather.forecast.forecastday[2].day.maxtemp_c,
        fourDayWeatherAveTemp: weather.forecast.forecastday[3].day.maxtemp_c,
        fiveDayWeatherAveTemp: weather.forecast.forecastday[4].day.maxtemp_c,
        oneDayWeather: weather.forecast.forecastday[0],
        twoDayWeather: weather.forecast.forecastday[1],
        threeDayWeather: weather.forecast.forecastday[2],
        fourDayWeather: weather.forecast.forecastday[3],
        fiveDayWeather: weather.forecast.forecastday[4],
      })
    })
  }

   setFinishLoading(){
     if (this.state.data == "") {
       this.setState({load: ""})
     } else {
       this.setState({load: "finished"})
       var currentWeather = this.state.currWeather
     }
   }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(this.success)
    console.log(this.state.currWeather)
    setInterval(() => {
    }, 5000);
  }


  render() {
    console.log(this.state.currWeather)
    const dayOne = this.state.oneDayWeather.day
    const LoadingProgress = (props) => {
    const { loading, done, } = props;
    const { checked } = this.state;
      if (done) {
        return (

          <div>
            <Grid container spacing={24}>
                  <Grid item xs={1.5}>
                    <img src={this.state.oneDayWeatherIcon} />
                    <Typography variant="subheading">{moment().add(1, 'days').calendar().slice(0, -11) + " " + this.state.oneDayWeatherAveTemp}˚C</Typography>
                    <Typography variant="caption">{this.state.oneDayWeatherText}</Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <img src={this.state.twoDayWeatherIcon} />
                      <Typography variant="subheading">{moment().add(2, 'days').calendar().slice(0, -11) + " " + this.state.twoDayWeatherAveTemp}˚C</Typography>
                      <Typography variant="caption">{this.state.twoDayWeatherText}</Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <img src={this.state.threeDayWeatherIcon} />
                      <Typography variant="subheading">{moment().add(3, 'days').calendar().slice(0, -11) + " " + this.state.threeDayWeatherAveTemp}˚C</Typography>
                      <Typography variant="caption">{this.state.threeDayWeatherText}</Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <img src={this.state.fourDayWeatherIcon} />
                      <Typography variant="subheading">{moment().add(4, 'days').calendar().slice(0, -11) + " " + this.state.fourDayWeatherAveTemp}˚C</Typography>
                      <Typography variant="caption">{this.state.fourDayWeatherText}</Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <img src={this.state.fiveDayWeatherIcon} />
                      <Typography variant="subheading">{moment().add(5, 'days').calendar().slice(0, -11) + " " + this.state.fiveDayWeatherAveTemp}˚C</Typography>
                      <Typography variant="caption">{this.state.fiveDayWeatherText}</Typography>
                  </Grid>
                </Grid>
             </div>
          );
      } else {
        return (
          <CardContent>
            <CircularProgress style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} size={50} />
          </CardContent>
        );
      }
    }
    return (

      <Card style={{maxWidth: 690,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <CardContent>
          <CardHeader
            title="5 Day Weather Forecast"
            subheader="Forecast data provided by Apixu"
            />
          <LoadingProgress
            loading={this.state.load}
            done={this.state.load}
            />
        </CardContent>

      </Card>

    );
  }
}

export default WeatherForecast;
