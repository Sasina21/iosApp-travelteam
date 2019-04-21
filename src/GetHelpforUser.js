import React, {Component} from 'react';
import {Alert, StyleSheet, TouchableHighlight, Image, ScrollView} from 'react-native';
import { Container, Content, Text, Button,Icon } from 'native-base';
import firebase from 'react-native-firebase'



export default class GetHelp extends Component {
  static navigationOptions = {
    tabBarIcon: ({focused}) => (
      <Icon name="alert"  />
    ),
    
  }
  constructor(props){
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      error: null
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.sendLocation = this.sendLocation.bind(this)
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        })
        console.log(this.state.latitude, this.state.longitude)
      }, error => this.setState({ error: error.message }),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
    )
  }

  sendLocation(){
    if(firebase.auth().currentUser != null){
      var dbGuide = firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/activeTrip/idGroup')
            dbGuide.once("value")
              .then(snapshot => {
                // console.log(snapshot.val())
                if(snapshot.val() !== null){
                  console.log(snapshot.val())
                  var dbGroup = firebase.database().ref("Groups/" + snapshot.val() + '/gps/' + firebase.auth().currentUser.uid)
                  dbGroup.update({
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    email: firebase.auth().currentUser.email
                  })
                }
              })
              Alert.alert('Success', 'Your location was sent to guide', [{text: 'Ok'}])
    }
  }
  render(){
    return(
      <Container>
       
        <Content style={{marginTop: '65%'}} >
        
        <Button danger style={{alignSelf: 'center'}} onPress={this.sendLocation}>
            <Text>Help Me!</Text>
        </Button>

        <Text style={{alignSelf: 'center', marginTop: '5%'}}>If you get lost ,Guide will know your GPS</Text>

        </Content>
        
      </Container>
    );
  }
  
}
