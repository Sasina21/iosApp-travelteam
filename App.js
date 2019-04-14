import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createSwitchNavigator, createStackNavigator , createBottomTabNavigator, createAppContainer} from 'react-navigation';
import { Icon } from 'native-base'
import RootNavigation from './src/navigation/RootNavigation';
import MainNavigation from './src/navigation/MainTabNavigation';
import firebase from 'react-native-firebase'
import ApiKeys from './ApiKeys'

// import MainScreen from 

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticationReady: false,
      isAuthenticated: true,
    }
  }

  componentWillMount(){
    if (!firebase.apps.length){
      firebase.initializeApp(ApiKeys.FirebaseConfig)
    }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged)
  }

  onAuthStateChanged = (user) => {
    this.setState({isAuthenticationReady: true})
    this.setState({isAuthenticated: !!user})
  }
  render(){
    // if(!this.state.isAuthenticationReady)
    console.log(this.state.isAuthenticated)
    return(
      <View style={{flex: 1}}>
        { this.state.isAuthenticated ? <MainNavigation/>:<RootNavigation/>}
      </View>
    )
  }
}