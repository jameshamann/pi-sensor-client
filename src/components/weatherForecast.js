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
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
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
    self.setFinishLoading()
    self.setState({
        oneDayWeatherIcon: weather.forecast.forecastday[0].day.condition.icon,
        twoDayWeatherIcon: weather.forecast.forecastday[1].day.condition.icon,
        threeDayWeatherIcon: weather.forecast.forecastday[2].day.condition.icon,
        fourDayWeatherIcon: weather.forecast.forecastday[3].day.condition.icon,
        fiveDayWeatherIcon: weather.forecast.forecastday[4].day.condition.icon,
        sixDayWeatherIcon: weather.forecast.forecastday[5].day.condition.icon,
        sevenDayWeatherIcon: weather.forecast.forecastday[6].day.condition.icon,
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
    console.log(this.state.currWeather)
    setInterval(() => {
    }, 5000);
  }


  render() {
    console.log(this.state.oneDayWeather.day)
    const dayOne = this.state.oneDayWeather.day
    const LoadingProgress = (props) => {
    const { loading, done, } = props;
      if (done) {
        return (
        <div>
          <Grid container spacing={24}>
                <Grid item xs={1.5}>
                  <img src={this.state.oneDayWeatherIcon} />
                  <Typography>Day of the week</Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <img src={this.state.twoDayWeatherIcon} />
                </Grid>
                <Grid item xs={1.5}>
                  <img src={this.state.threeDayWeatherIcon} />
                </Grid>
                <Grid item xs={1.5}>
                  <img src={this.state.fourDayWeatherIcon} />

                </Grid>
                <Grid item xs={1.5}>
                  <img src={this.state.fiveDayWeatherIcon} />

                </Grid>
                <Grid item xs={1.5}>
                  <img src={this.state.sixDayWeatherIcon} />

                </Grid>
                <Grid item xs={1.5}>
                  <img src={this.state.sevenDayWeatherIcon} />

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
    console.log(this.state.oneDayWeatherIcon)
    return (
      <Card style={{maxWidth: 690,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <CardContent>
          <LoadingProgress
            loading={this.state.load}
            done={this.state.load}
            />
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
