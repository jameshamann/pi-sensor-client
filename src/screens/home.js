import React, { Component } from 'react';
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


class Home extends Component {

  constructor(props){
    super(props);
    this.getWeather()
    this.state = {
      temp: '', humidity: '', time_stamp: '', data: '', iot: '', load: '', one_day_weather: '', two_day_weather: '', three_day_weather: '', four_day_weather: '', five_day_weather: ''
    }
  }

  getWeather(){
    var self = this;
    fetch('http://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=70a4981e434162e1f2eaeacce6268cdc')
    .then(function(weather) {
      return weather.json()
    }).then(function(weather) {
      console.log(weather)
      self.setState({
        one_day_weather: weather.list[4],
        two_day_weather: weather.list[9],
        three_day_weather: weather.list[14],
        four_day_weather: weather.list[19],
        five_day_weather: weather.list[24]
        })
    })
  }

  get_time_int = function (uuid_str) {

  if (uuid_str == "") {
    return "Awaiting Data"
  } else {
       var uuid_arr = uuid_str.split( '-' ),
           time_str = [
               uuid_arr[ 2 ].substring( 1 ),
               uuid_arr[ 1 ],
               uuid_arr[ 0 ]
           ].join( '' );
       return parseInt( time_str, 16 );
     }
   };

   get_date_obj = function (uuid_str) {
     if (uuid_str == "") {
       return "Awaiting Data"
     } else {
       var int_time = this.get_time_int( uuid_str ) - 122192928000000000,
           int_millisec = Math.floor( int_time / 10000 );
       return new Date( int_millisec );
     }
   };

  async latestID(){
     Amplify.addPluggable(new AWSIoTProvider({
      aws_pubsub_region: 'eu-west-2',
      aws_pubsub_endpoint: 'wss://azjo7hto1k82k.iot.eu-west-2.amazonaws.com/mqtt',
    }));
    PubSub.subscribe('temp_and_humidity').subscribe({
     next: data => this.setState({iot: data.value.id}),
     error: error => console.error(error),
     close: () => console.log('Done'),
 });

   }

   setFinishLoading(){
     if (this.state.data == "") {
       this.setState({load: ""})
     } else {
       this.setState({load: "finished"})
     }
   }

  componentDidMount(){
    this.getWeather()
    this.latestID()
    let apiName = 'PiSensorDataCRUD';
    let path = '/PiSensorData/'+this.state.iot;
    API.get(apiName, path).then(response => {
      console.log(response)
        this.setState({
          temp: response[0].payload.temp,
          humidity: response[0].payload.humidity,
          time_stamp: response[0].ID,
          data: response
        })
    }).catch(error => {
        console.log(error.response)
    });
    setInterval(() => {
      this.setFinishLoading()
      let apiName = 'PiSensorDataCRUD';
      let path = '/PiSensorData/'+this.state.iot;
      console.log(this.state.iot)
      API.get(apiName, path).then(response => {
        console.log(response)
          this.setState({
            temp: response[0].payload.temp,
            humidity: response[0].payload.humidity,
            time_stamp: response[0].ID,
            data: response
          })
      }).catch(error => {
          console.log(error.response)
      });
    }, 5000);



    var date_obj = this.get_date_obj(this.state.iot);
    console.log(date_obj.toLocaleString())
  }

  render() {
    const weather_data = this.state.one_day_weather
    var temp_data = ""
    var weather_desc = ""
    var iconLink = ""
    _.map(weather_data, ({ clouds, dt, dt_txt, main, sys, weather, wind }) => (
        temp_data = weather_data.main.temp - 273.15,
        weather_desc = weather_data.weather[0].main + " " + weather_data.weather[0].description,
        iconLink = "http://openweathermap.org/img/w/" + weather_data.weather[0].icon + ".png"
    ))
    console.log(iconLink)
    const one_day_weather = this.state.one_day_weather
    const data = this.state.data;
    const lastReading = this.get_date_obj(this.state.iot)
    const LoadingProgress = (props) => {
    const { loading, done, } = props;
      if (done) {
        return (
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              Tempreature {this.state.temp}˚C
            </Typography>
            <Typography gutterBottom variant="headline" component="h2">
              Humidity {this.state.humidity}%
            </Typography>
              <Typography component="p">
              Last Reading: {lastReading.toLocaleString()}
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
    console.log(this.state.weatherIcon)
    return (
    <MuiThemeProvider>
      <AppBar
         title="Raspberry Pi Weather Dashboard"
         iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <br />
      <br />
      <div>
        <Grid container spacing={24}>
          <Grid item xs={2} sm={1}>
          </Grid>
          <Grid item xs={6} sm={3}>
          <Card style={{maxWidth: 345,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <LoadingProgress
                loading={this.state.load}
                done={this.state.load}
                />
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>

      <Grid item xs={12} sm={6}>
      <Card style={{maxWidth: 600,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <CardContent>
          <Typography><img src={iconLink}></img></Typography>
          <Typography>Day One</Typography>
          <Typography>{temp_data}</Typography>
          <Typography>{weather_desc}</Typography>


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
       </Grid>
     </Grid>
     </div>
    </MuiThemeProvider>

    );
  }
}

export default Home;
