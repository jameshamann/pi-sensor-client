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




class Home extends Component {

  constructor(props){
    super(props);
    this.state = {temp: '', humidity: '', time_stamp: '', data: ''}

  }


  componentDidMount(){
    let apiName = 'pi_sensor_dataCRUD';
    let path = '/pi_sensor_data/facf2c6a-8903-11e8-9085-b827eb93cade';
    API.get(apiName, path).then(response => {
        this.setState({
          temp: response,
          humidity: response,
          time_stamp: response,
          data: response
        })
    }).catch(error => {
        console.log(error.response)
    });
  }

  render() {
    console.log(this.state.data[0])
    return (
    <MuiThemeProvider>
      <AppBar
         title="Dashboard"
         iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <RaisedButton label="Hello World!" />
      <div>
      <Card style={{maxWidth: 345,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {this.state.data.payload}
          </Typography>
          <Typography component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
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
