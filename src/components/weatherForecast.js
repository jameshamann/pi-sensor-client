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
const uuidv1 = require('uuid/v1');


class WeatherForecast extends Component {

  constructor(props){
    super(props);
    this.success = this.success.bind(this)
    this.state = {
      geolat: '', geolong: '', currWeather: '', oneDayWeather: '', twoDayWeather: '',
      threeDayWeather: '', fourDayWeather: '', fiveDayWeather: '', sixDayWeather: '', sevenDayWeather: ''
    }
  }

  success(pos){
  var self = this;
  this.setState({
    geolat: pos.coords.latitude,
    geolong: pos.coords.longitude
  });
  fetch('https://api.apixu.com/v1/forecast.json?key=f01f15ee25ab4951abb154119182507&q=' + this.state.geolat + "," + this.state.geolong + '&days=7')
  .then(function(weather) {
    return weather.json()
  }).then(function(weather) {
    self.props.getWeather(weather.current)
    self.setState({
        currWeatherIcon: weather.current.condition.icon,
        currWeather: weather.current,
        oneDayWeather: weather.forecast.forecastday[0],
        twoDayWeather: weather.forecast.forecastday[1],
        threeDayWeather: weather.forecast.forecastday[2],
        fourDayWeather: weather.forecast.forecastday[3],
        fiveDayWeather: weather.forecast.forecastday[4],
        sixDayWeather: weather.forecast.forecastday[5],
        sevenDayWeather: weather.forecast.forecastday[6]
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
    this.setFinishLoading()
    console.log(this.state.currWeather)
    setInterval(() => {
    }, 5000);
  }


  render() {
    const LoadingProgress = (props) => {
    const { loading, done, } = props;
      if (done) {
        return (
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
            </Typography>
            <Typography gutterBottom variant="headline" component="h2">
            </Typography>
              <Typography component="p">
              </Typography>
            </CardContent>
          );
      } else {
        return (
          <CardContent>
            <CircularProgress style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} size={50} />
          </CardContent>
        );
      }
    }
    console.log(this.state.oneDayWeather.date)
    console.log(this.state.weatherIcon)
    return (
      <Card style={{maxWidth: 600,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <CardContent>

        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
        </Card>
    );
  }
}

export default WeatherForecast;
