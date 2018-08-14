import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Amplify, { API, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import CircularProgress from '@material-ui/core/CircularProgress';

class PiSensor extends Component {

  constructor(props){
    super(props);
    this.getDaylightHours = this.getDaylightHours.bind(this)
    this.state = {
      temp: '', humidity: '', time_stamp: '', data: '',
      iot: '', load: '', daylightHours: ''
    }
  }

get_time_int = function (uuid_str) {

  if (uuid_str === "") {
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
     if (uuid_str === "") {
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
     if (this.state.data === "") {
       this.setState({load: ""})
     } else {
       this.setState({load: "finished"})
     }
   }

   getDaylightHours(){
    var self = this;
    fetch('https://api.sunrise-sunset.org/json?lat=' + this.props.latitude + '&lng=' + this.props.longitude)
      .then(function(res){
        return res.json()
      }).then(function(res) {
        self.setState({daylightHours: res.results})
      });
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
      console.log("IM A TIMER IN PI")
      this.getDaylightHours()
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
    console.log(this.state.daylightHours.day_length)
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    const lastReading = this.get_date_obj(this.state.iot)
    const LoadingProgress = (props) => {
    const { done } = props;
      if (done) {
        return (
          <CardContent>

            <div>
              <img alt="Weather Icon" width="64" height="64" src={this.props.currWeather.condition.icon}></img>
            </div>
            <Typography component="p">{this.props.currWeather.condition.text}, Feels Like: {this.props.currWeather.feelslike_c}˚C</Typography>
            <Typography component="p">
              Tempreature: {this.state.temp}˚C
            </Typography>
            <Typography component="p">
              Humidity: {this.state.humidity}%
            </Typography>
            <Typography component="p">
              Predicted Rainfall: {this.props.currWeather.precip_mm} mm(s)
            </Typography>
              <Typography component="p">
              Last Reading: {lastReading.toLocaleString().substring(12)}
              </Typography>
              <Typography component="p">
              Hours of Daylight: {this.state.daylightHours.day_length}
              </Typography>
            </CardContent>

          );
      } else {
        return (
          <CardContent>
            <CircularProgress size={50} style={{justifyContent: 'center', alignItems: 'center'}} />
          </CardContent>
        );
      }
    }
    return (
          <Card style={{maxWidth: 345,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <CardHeader
              title="Current Weather"
              subheader={today.toLocaleDateString("en-US", options)}
              />
              <LoadingProgress
                loading={this.state.load}
                done={this.state.load}
                />

          </Card>
        );
  }
}

export default PiSensor;
