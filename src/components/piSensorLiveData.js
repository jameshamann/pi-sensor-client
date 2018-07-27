import React, { Component } from 'react';
import { PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Amplify, { API, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import _ from 'lodash'
import CircularProgress from '@material-ui/core/CircularProgress';
import WeatherForecast from '../components/weatherForecast'
import BuildIcon from '@material-ui/icons/Build';

class PiSensor extends Component {

  constructor(props){
    super(props);
    this.state = {
      temp: '', humidity: '', time_stamp: '', data: '',
      iot: '', load: ''
    }
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
    const data = this.state.data;
    console.log(this.props.currWeather)
    const lastReading = this.get_date_obj(this.state.iot)
    const LoadingProgress = (props) => {
    const { loading, done, } = props;
      if (done) {
        return (
          <CardContent>
            <CardHeader
              title="Current Weather"
              subheader="Live Data provided by Pi Sensors"
              />
            <div style={{marginLeft: "8px"}}>
              <img width="64" height="64" src={this.props.currWeather.condition.icon}></img>
            </div>
            <Typography component="p" style={{marginLeft: "25px"}}>{this.props.currWeather.condition.text}, Feels Like: {this.props.currWeather.feelslike_c}˚C</Typography>
            <Typography component="p" style={{marginLeft: "25px"}}>
              Tempreature: {this.state.temp}˚C
            </Typography>
            <Typography component="p" style={{marginLeft: "25px"}}>
              Humidity: {this.state.humidity}%
            </Typography>
              <Typography component="p" style={{marginLeft: "25px"}}>
              Last Reading: {lastReading.toLocaleString()}
              </Typography>
            </CardContent>
          );
      } else {
        return (
          <CardContent>
            <CircularProgress size={50} style={{justifyContent: 'center', alignItems: 'center'}} size={50} />
          </CardContent>
        );
      }
    }
    console.log(this.state.weatherIcon)
    return (
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
        );
  }
}

export default PiSensor;
