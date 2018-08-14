import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Grid from '@material-ui/core/Grid';
import WeatherForecast from '../components/weatherForecast'
import PiSensor from '../components/piSensorLiveData'
import Watering from '../components/watering'
import CropTable from '../components/cropTable'

class Home extends Component {

  constructor(props){
    super(props)
    this.state = {currWeather: '', longitude: '', latitude: ''}
    this.nowWeather = this.nowWeather.bind(this);

  }

  nowWeather = (currWeather, longitude, latitude) => {
    this.setState({currWeather: currWeather, longitude: longitude, latitude: latitude})

  }

  componentDidMount(){
    this.nowWeather()
  }

  render() {
    console.log(this.state.currWeather)
    return (
    <MuiThemeProvider>
      <AppBar
         title="Raspberry Pi Weather Dashboard"
         iconClassNameRight="muidocs-icon-navigation-expand-more"
         style={{ backgroundColor: '#039be5' }}
      />
      <br />
      <br />
      <div>
        <Grid container spacing={24}>
          <Grid item xs={1} sm={2}>
          </Grid>
          <Grid item xs={1} sm={3}>
            <PiSensor currWeather={this.state.currWeather} showFiveDayForecast={this.showForecast} longitude={this.state.longitude} latitude={this.state.latitude}/>
          </Grid>
          <Grid item xs={1} sm={6}>
            <WeatherForecast getWeather={this.nowWeather} />
           </Grid>
         <Grid item xs={1} sm={2}>
         </Grid>
         <Grid item xs={1} sm={3}>
           <Watering currWeather={this.state.currWeather} />
         </Grid>
         <Grid item xs={1} sm={6}>
             <CropTable />
         </Grid>
     </Grid>
     </div>
    </MuiThemeProvider>

    );
  }
}

export default Home;
