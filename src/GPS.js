import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createSwitchNavigator, createAppContainer} from 'react-navigation';
import { Icon } from 'native-base'
import firebase from 'react-native-firebase'
import Mapforguide from './Mapforguide'
import GetHelpforUser from './GetHelpforUser'

// import MainScreen from 

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component{
  static navigationOptions = {
    tabBarIcon: ({focused}) => (
      <Icon name="alert"  />
    ),
    
  }
  constructor(props) {
    super(props);
    this.state = {
      checkGuide: false,
      check: false

    }
  }

  componentWillMount(){
    console.log(firebase.auth().currentUser.uid)
    if(firebase.auth().currentUser != null){
      let dbGuide = firebase.database().ref('Guides/' + firebase.auth().currentUser.uid)
      // dbGuide.keepSynced(true)
      dbGuide.once("value")
        .then(snapshot => {
          // console.log(snapshot.val())
          if(snapshot.val().Id_company !== null){
            this.setState({
              checkGuide: true,
            })
          }
          this.setState({
            check: true
          })
        })
    }
  }

  render(){
   
    return(
      <View style={{flex: 1}}>
        { this.state.checkGuide ? <Mapforguide/> : <GetHelpforUser/> }
      </View>
    )
  }
}