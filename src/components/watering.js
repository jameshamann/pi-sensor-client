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
import CloudyIcon from '@material-ui/icons/Cloud';

class Watering extends Component {

  constructor(props){
    super(props);
    this.state = {
      temp: '', humidity: '', time_stamp: '', data: 'Test',
      iot: '', load: ''
    }
    this.setWateringStatus = this.setWateringStatus.bind(this)
  }


   setFinishLoading(){
     if (this.props.currWeather == "") {
       this.setState({load: ""})
     } else {
       this.setState({load: "finished"})
     }
   }

  componentDidMount(){

    setInterval(() => {
      this.setFinishLoading()
      this.setWateringStatus(this.props.currWeather.precip_mm)
    }, 5000);
  }

  setWateringStatus(precip){
    console.log(precip)
    if (precip == 0) {
      return (
          <Typography variant="subheading" style={{marginLeft: "25px"}}>
            {precip} mms Rainfall Expected Today. <br />
            Water your plants!
        </Typography>
      )
    } else {
      return (
        <Typography variant="subheading" style={{marginLeft: "25px"}}>{precip}mms Rainfall Expected Today, there is no need to water your plants.</Typography>
      )
    }
  }


  render() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();

    const LoadingProgress = (props) => {
    const { loading, done, } = props;
      if (done) {
        return (
          <CardContent>
            <CardHeader
              title="Rain Forecast"
              subheader="Watering Requirement"
              avatar={
              <Avatar>
                <CloudyIcon />
              </Avatar>
            }
              />
            <div style={{marginLeft: "8px"}}>
            </div>
              {this.setWateringStatus(this.props.currWeather.precip_mm)}
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
    return (
          <Card style={{maxWidth: 345,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <LoadingProgress
                loading={this.state.load}
                done={this.state.load}
                />
          
          </Card>
        );
  }
}

export default Watering;
