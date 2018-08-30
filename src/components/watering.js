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
    this.state = {
        time: 0,
        load: '',
        buttonDisplay: 'none',
        prevWateringDate: '',
        prevWateringTime: 0
      }
    this.startWatering = this.startWatering.bind(this)
    this.stopWatering = this.stopWatering.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)

  }

  startTimer() {
    const start = Date.now() - this.state.time;
    this.timer = setInterval(() => {
        this.setState({time: Date.now() - start});
      });
    }

  stopTimer() {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric" };
    var today = new Date()
    this.setState({prevWateringDate: today.toLocaleDateString("en-US", options), prevWateringTime: this.state.time, time: 0})
    clearInterval(this.timer)
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
     if (this.state.load === "finished"){
       this.setState({buttonDisplay: ""})
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
    clearInterval(this.timer)
    setInterval(() => {
        this.setFinishLoading()
      // this.stopTimer()
      // this.setWateringStatus(this.props.currWeather.precip_mm)
    }, 5000);
  }

  setWateringStatus(precip){
    if (precip === 0) {
      return (
            <Grid item xs={1.2} style={{marginLeft: '15px'}}>
                <Typography variant="headline">
                    No Rainfall predicted for today, watering is required.
                </Typography>
                <br />
                <Typography variant='subheading'>
                    Watering will be automated, if more is required water flow can be controlled below using the relevant buttons.
                    Monitor moisture and watering amount to ensure crops are not over watered.
                </Typography>
            </Grid>

      )
    } else {
      return (

        <Grid item xs={1.2} style={{marginLeft: '10px'}}>
        <Typography variant="subheading">{precip}mms Rainfall Expected Today, watering will not take place.
          If more is required, water flow can be controlled below.
          Monitor moisture and watering amount to ensure crops are not over watered.
        </Typography>
      </Grid>
      )
    }
  }

  render() {
    const {time, start, prevWateringDate, prevWateringTime} = this.state;
    const wateringTime = "Previously watered on " + prevWateringDate + " for " + ms(prevWateringTime)
    const LoadingProgress = (props) => {
    const { done, } = props;
    const self = this;
      if (done && this.props.currWeather != null) {
        return (
            <div>
              {this.setWateringStatus(this.props.currWeather.precip_mm)}
            </div>


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
              subheader={wateringTime}
              />
              <CardContent>
                <Grid container spacing={24}>
              <LoadingProgress
                loading={this.state.load}
                done={this.state.load}
                />
              <Grid item xs={1.2} style={{display: this.state.buttonDisplay}}>
                    <Button variant="contained" color="primary" onClick={this.startWatering.bind(this)}>
                      Start Watering
                    </Button>
                </Grid>
                <Grid item xs={1.2} style={{display: this.state.buttonDisplay}}>
                  <Button variant="contained"  color="primary" onClick={this.stopWatering.bind(this)}>
                    End Watering
                  </Button>
                </Grid>
                  <Grid item style={{display: this.state.buttonDisplay}}>
                      <Typography variant="subheading">Timer: {ms(time)}</Typography>
                  </Grid>
                </Grid>
             </CardContent>

          </Card>
        );
  }
}

export default Watering;
