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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

class Watering extends Component {

  constructor(props){
    super(props);
    this.state = {load: ''}
    this.setWateringStatus = this.setWateringStatus.bind(this)
  }


   setFinishLoading(){
     if (this.props.currWeather == "") {
       this.setState({load: ""})
     } else {
       this.setState({load: "finished"})
     }
   }

   startWatering(){
      PubSub.publish('water_flow_status', { water_flow_status: 'on' });
   }

   stopWatering(){
     PubSub.publish('water_flow_status', { water_flow_status: 'off' });
   }

  componentDidMount(){

    setInterval(() => {
      this.setFinishLoading()
      // this.setWateringStatus(this.props.currWeather.precip_mm)
    }, 5000);
  }

  setWateringStatus(precip){
    console.log(precip)
    if (precip == 0) {
      return (
        <CardContent>
          <Grid container spacing={24}>
            <Grid item>
                <Typography variant="headline">
                    No Rainfall predicted for today, watering is required.
                </Typography>
                <br />
                <Typography variant='subheading'>
                    Watering will be automated, if more is required water flow can be controlled below using the relevant buttons.
                    Monitor moisture and watering amount to ensure crops are not over watered.
                </Typography>
            </Grid>
            <Grid item xs={1.2}>
                <Button variant="contained" color="primary" onClick={() => { this.startWatering() }}>
                  Start Watering
                </Button>
            </Grid>
          <Grid item xs={1.2}>
            <Button variant="contained" color="primary" onClick={() => { this.stopWatering() }}>
              End Watering
            </Button>
          </Grid>
          </Grid>
      </CardContent>
      )
    } else {
      return (
    <CardContent>
      <Grid container spacing={24}>
        <Grid item>
        <Typography variant="subheading" style={{marginLeft: "25px"}}>{precip}mms Rainfall Expected Today, watering will not take place.
          If more is required, water flow can be controlled below.
          Monitor moisture and watering amount to ensure crops are not over watered.
        </Typography>
      </Grid>

        <Grid item xs={1.2}>
            <Button variant="contained" color="primary" onClick={() => { this.startWatering() }}>
              Start Watering
            </Button>
        </Grid>
      <Grid item xs={1.2}>
        <Button variant="contained" color="primary" onClick={() => { this.stopWatering() }}>
          End Watering
        </Button>
      </Grid>
    </Grid>
  </CardContent>
      )
    }
  }

  render() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    const LoadingProgress = (props) => {
    const { loading, done, } = props;
      if (done && this.props.currWeather != null) {
        return (
          <div style={{marginRight: "3  0px"}}>
            {this.setWateringStatus(this.props.currWeather.precip_mm)}
          </div>

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
            <CardHeader
              title="Watering Status"
              subheader="Current Status: Live, Last Reading: 12:00"
              />
              <LoadingProgress
                loading={this.state.load}
                done={this.state.load}
                />
          </Card>
        );
  }
}

export default Watering;
