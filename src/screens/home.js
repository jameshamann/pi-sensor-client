import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Grid from '@material-ui/core/Grid';
import WeatherForecast from '../components/weatherForecast'
import PiSensor from '../components/piSensorLiveData'
import Watering from '../components/watering'
import CropTable from '../components/cropTable'
import UserIcon from '@material-ui/icons/Person';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


class Home extends Component {

  constructor(props){
    super(props)
    this.state = {currWeather: '', longitude: '', latitude: ''}
    this.nowWeather = this.nowWeather.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleMenu = this.handleMenu.bind(this);


  }

  nowWeather = (currWeather, longitude, latitude) => {
    this.setState({currWeather: currWeather, longitude: longitude, latitude: latitude})

  }

  componentDidMount(){
    this.nowWeather()
  }

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const open = Boolean(anchorEl);
    const { auth, anchorEl } = this.state;
    console.log(this.state.currWeather)
    return (
    <MuiThemeProvider>
      <AppBar
         title="Raspberry Pi Weather Dashboard"
         iconClassNameRight="muidocs-icon-navigation-expand-more"
         style={{ backgroundColor: '#039be5' }}
         position="static"
      >
      <Toolbar>

        <Button style={{color: 'white', textTransform: 'none', fontSize: 11 }} onClick={this.handleMenu}>
          <Icon style={{paddingRight: 2, color: 'white'}}>
            <UserIcon />
          </Icon>
          {this.props.userData.name}
        </Button>
        <Menu
         id="menu-appbar"
         anchorEl={anchorEl}
         anchorOrigin={{
           vertical: 'top',
           horizontal: 'right',
         }}
         open={open}
         onClose={this.handleClose}
       >
         <MenuItem onClick={this.handleClose}>Profile</MenuItem>
         <MenuItem onClick={this.handleClose}>My account</MenuItem>
       </Menu>
        </Toolbar>
    </AppBar>
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
