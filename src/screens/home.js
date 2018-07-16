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
import Amplify, { API } from 'aws-amplify';
import _ from 'lodash'



class Home extends Component {

  constructor(props){
    super(props);
    this.state = {temp: '', humidity: '', time_stamp: '', data: ''}

  }


  componentDidMount(){
    let apiName = 'pi_sensor_dataCRUD';
    let path = '/pi_sensor_data/960584e2-8939-11e8-87bc-b827eb93cade';
    API.get(apiName, path).then(response => {
      console.log(response[0].payload.temp)
        this.setState({
          temp: response[0].payload.temp,
          humidity: response[0].payload.humidity,
          time_stamp: response[0].ID,
          data: response
        })
    }).catch(error => {
        console.log(error.response)
    });
  }

  render() {
    console.log(this.state.temp)
    const data = this.state.data;
    console.log(data)
    return (
    <MuiThemeProvider>
      <AppBar
         title="Dashboard"
         iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      
      <div>
      <Card style={{maxWidth: 345,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <CardContent>

        <Typography gutterBottom variant="headline" component="h2">
          Tempreature {this.state.temp}˚C
        </Typography>
        <Typography gutterBottom variant="headline" component="h2">
          Humidity {this.state.humidity}%
        </Typography>


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
      </div>
    </MuiThemeProvider>

    );
  }
}

export default Home;
