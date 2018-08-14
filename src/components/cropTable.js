import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

class CropTable extends Component {

  constructor(props){
    super(props);
    this.state = {
      temp: '', humidity: '', time_stamp: '', data: 'Test',
      iot: '', load: ''
    }
    this.setWateringStatus = this.setWateringStatus.bind(this)
  }


   setFinishLoading(){
     if (this.props.currWeather === "") {
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
    if (precip === 0) {
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
    const LoadingProgress = (props) => {
    const { done } = props;
      if (done) {
        return (
          <CardContent>
            <div style={{marginLeft: "8px"}}>
              <Table>
               <TableHead>
                 <TableRow>
                   <TableCell>Crop</TableCell>
                   <TableCell numeric>Soil Moisture (mms)</TableCell>
                   <TableCell date>Last Watered</TableCell>
                   <TableCell numeric>Amount Watered (mms)</TableCell>
                   <TableCell date>Last Harvest</TableCell>

                 </TableRow>
               </TableHead>
               <TableBody>
                   <TableRow>
                     <TableCell component="th" scope="row">
                       Corn
                     </TableCell>
                     <TableCell numeric>0.47</TableCell>
                     <TableCell date>06/07/18</TableCell>
                     <TableCell numeric>1.78</TableCell>
                     <TableCell date>06/07/18</TableCell>

                   </TableRow>
                   <TableRow>
                     <TableCell component="th" scope="row">
                       Onions
                     </TableCell>
                     <TableCell numeric>0.89</TableCell>
                     <TableCell date>06/07/18</TableCell>
                     <TableCell numeric>1.3</TableCell>
                     <TableCell date>06/07/18</TableCell>

                   </TableRow>
                   <TableRow>
                     <TableCell component="th" scope="row">
                       Peppers
                     </TableCell>
                     <TableCell numeric>0.34</TableCell>
                     <TableCell date>06/07/18</TableCell>
                     <TableCell numeric>1.4</TableCell>
                     <TableCell date>06/07/18</TableCell>
                   </TableRow>
                   <TableRow>
                     <TableCell component="th" scope="row">
                       Tomatoes
                     </TableCell>
                     <TableCell numeric>0.56</TableCell>
                     <TableCell date>06/07/18</TableCell>
                     <TableCell numeric>2.5</TableCell>
                     <TableCell date>06/07/18</TableCell>
                   </TableRow>
               </TableBody>
             </Table>
            </div>
            <br />
            <Tooltip title="Add Crops" style={{marginLeft: "50px;", position: 'absolute', fontSize: "10px;"}}>
               <Button variant="fab" color="blue" aria-label="Add Crops">
                 <AddIcon />
               </Button>
            </Tooltip>
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
          <Card style={{maxWidth: 690,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <CardHeader
              title="Crop Breakdown"
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

export default CropTable;
