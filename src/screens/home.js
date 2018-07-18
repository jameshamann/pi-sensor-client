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
import Amplify, { API } from 'aws-amplify';
import _ from 'lodash'
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis} from 'react-vis';
const uuidv1 = require('uuid/v1');


class Home extends Component {

  constructor(props){
    super(props);
    this.state = {temp: '', humidity: '', time_stamp: '', data: ''}

  }

  get_time_int = function (uuid_str) {
       var uuid_arr = uuid_str.split( '-' ),
           time_str = [
               uuid_arr[ 2 ].substring( 1 ),
               uuid_arr[ 1 ],
               uuid_arr[ 0 ]
           ].join( '' );
       return parseInt( time_str, 16 );
   };

   get_date_obj = function (uuid_str) {
       var int_time = this.get_time_int( uuid_str ) - 122192928000000000,
           int_millisec = Math.floor( int_time / 10000 );
       return new Date( int_millisec );
   };

   getLatest(){
     let apiName = 'pi-sensor-dataCRUD';
     let path = '/latest-reading';
     API.get(apiName, path).then(response => {
       console.log(response)
     }).catch(error => {
         console.log(error.response)
     });
   }

  componentDidMount(){
    let apiName = 'pi-sensor-dataCRUD';
    let path = '/pi-sensor-data/006f776e-8a59-11e8-b11c-b827eb93cade';
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
    this.getLatest()
    var date_obj = this.get_date_obj('006f776e-8a59-11e8-b11c-b827eb93cade');
    console.log(date_obj.toLocaleString())
  }

  render() {
    const graphData = [
      {x: 0, y: 8},
      {x: 1, y: 5},
      {x: 2, y: 4},
      {x: 3, y: 9},
      {x: 4, y: 1},
      {x: 5, y: 7},
      {x: 6, y: 6},
      {x: 7, y: 3},
      {x: 8, y: 2},
      {x: 9, y: 0}
    ];
    const graphDataTwo = [
      {x: 0, y: 9},
      {x: 1, y: 8},
      {x: 2, y: 6},
      {x: 3, y: 6},
      {x: 4, y: 5},
      {x: 5, y: 4},
      {x: 6, y: 5},
      {x: 7, y: 2},
      {x: 8, y: 1},
      {x: 9, y: 6}
    ];
    const data = this.state.data;
    const lastReading = this.get_date_obj('006f776e-8a59-11e8-b11c-b827eb93cade')
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
          <Grid item xs={6} sm={3}>
          </Grid>
          <Grid item xs={6} sm={3}>
          <Card style={{maxWidth: 345,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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

      <Grid item xs={6} sm={3}>
      <Card style={{maxWidth: 345,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <XYPlot height={300} width={300}>
        <YAxis hideLine tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} />
          <XAxis bottom hideLine tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} />
            <VerticalGridLines />
            <HorizontalGridLines />
           <LineSeries data={graphData} />
          <LineSeries data={graphDataTwo} />
         </XYPlot>
        </Card>
       </Grid>
     </Grid>
     </div>
    </MuiThemeProvider>

    );
  }
}

export default Home;
