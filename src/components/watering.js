import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PubSub from 'aws-amplify';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ms from "pretty-ms"
import Paper from '@material-ui/core/Paper';


class Watering extends Component {

  constructor(props){
    super(props);
    this.setWateringStatus = this.setWateringStatus.bind(this)
    this.state = {
        time: 0,
        isOn: false,
        start: 0,
        load: ''
      }
    this.startWatering = this.startWatering.bind(this)
    this.stopWatering = this.stopWatering.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }

  startTimer() {
    this.setState({
      isOn: true,
      time: this.state.time,
      start: Date.now() - this.state.time
    })
  
  }

  stopTimer() {
    this.setState({
      isOn: false,
      time: Date.now() - this.state.start
    })
  }

  resetTimer() {
    this.setState({time: 0, isOn: false})
  }


   setFinishLoading(){
     if (this.props.currWeather === "") {
       this.setState({load: ""})
     } else {
       this.setState({load: "finished"})
     }
   }

   startWatering(){
      this.startTimer()
      // PubSub.publish('water_flow_status', { water_flow_status: 'on' });
   }

   stopWatering(){
     this.stopTimer()
     // PubSub.publish('water_flow_status', { water_flow_status: 'off' });
   }

  componentDidMount(){
    setInterval(() => {
        this.setFinishLoading()
      // this.stopTimer()
      // this.setWateringStatus(this.props.currWeather.precip_mm)
    }, 5000);
  }

  setWateringStatus(precip){
    if (precip === 0) {
      return (
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
                <Button variant="contained" color="primary" onClick={this.startWatering}>
                  Start Watering
                </Button>
            </Grid>
          <Grid item xs={1.2}>
            <Button variant="contained"  color="primary" onClick={this.stopWatering}>
              End Watering
            </Button>
          </Grid>
            <Grid item>
                <Typography variant="subheading">Timer: {ms(this.state.time)}</Typography>
            </Grid>
          </Grid>
      )
    } else {
      return (
      <Grid container spacing={24}>
        <Grid item>
        <Typography variant="subheading">{precip}mms Rainfall Expected Today, watering will not take place.
          If more is required, water flow can be controlled below.
          Monitor moisture and watering amount to ensure crops are not over watered.
        </Typography>
      </Grid>

        <Grid item xs={1.2}>
            <Button variant="contained" color="primary" onClick={this.startWatering}>
              Start Watering
            </Button>
        </Grid>
      <Grid item xs={1.2}>
        <Button variant="contained" color="primary" onClick={this.stopWatering}>
          End Watering
        </Button>
      </Grid>
      <Grid item>
          <Typography variant="subheading">Timer: {ms(this.state.time)}</Typography>
      </Grid>
    </Grid>
      )
    }
  }

  render() {
    const LoadingProgress = (props) => {
    const { done, } = props;
      if (done && this.props.currWeather != null) {
        return (
          <CardContent>
            {this.setWateringStatus(this.props.currWeather.precip_mm)}
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
