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
      // this.setWateringStatus(this.props.currWeather.precip_mm)
    }, 5000);
  }

  setWateringStatus(precip){
    console.log(precip)
    if (precip == 0) {
      return (
          <Typography variant="subheading" style={{marginLeft: "25px"}}>

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
            <div style={{marginLeft: "8px"}}>
              <Table>
               <TableHead>
                 <TableRow>
                   <TableCell>Watering Sector</TableCell>
                   <TableCell numeric>Soil Moisture (mms)</TableCell>
                   <TableCell numeric>Last Watered</TableCell>
                   <TableCell numeric>Amount Watered (mms)</TableCell>
                   <TableCell numeric>Last Harvest</TableCell>

                 </TableRow>
               </TableHead>
               <TableBody>
                   <TableRow>
                     <TableCell component="th" scope="row">
                       Corn
                     </TableCell>
                     <TableCell numeric>0.47</TableCell>
                     <TableCell numeric>06/07/18</TableCell>
                     <TableCell numeric>1.78</TableCell>
                     <TableCell date>06/07/18</TableCell>

                   </TableRow>
                   <TableRow>
                     <TableCell component="th" scope="row">
                       Onions
                     </TableCell>
                     <TableCell numeric>0.89</TableCell>
                     <TableCell numeric>06/07/18</TableCell>
                     <TableCell numeric>1.3</TableCell>
                     <TableCell date>06/07/18</TableCell>

                   </TableRow>
                   <TableRow>
                     <TableCell component="th" scope="row">
                       Peppers
                     </TableCell>
                     <TableCell numeric>0.34</TableCell>
                     <TableCell numeric>06/07/18</TableCell>
                     <TableCell numeric>1.4</TableCell>
                     <TableCell date>06/07/18</TableCell>
                   </TableRow>
                   <TableRow>
                     <TableCell component="th" scope="row">
                       Tomatoes
                     </TableCell>
                     <TableCell numeric>0.56</TableCell>
                     <TableCell numeric>06/07/18</TableCell>
                     <TableCell numeric>2.5</TableCell>
                     <TableCell date>06/07/18</TableCell>
                   </TableRow>
               </TableBody>
             </Table>
            </div>
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
          <Card style={{maxWidth: 1035,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <CardHeader
              title="Farming System"
              subheader="Current Status: Live"
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
