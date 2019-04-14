import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createSwitchNavigator, createStackNavigator , createBottomTabNavigator, createAppContainer} from 'react-navigation';
import { Icon } from 'native-base'
import Home from '../Home'
import Schedule from '../Schedule'
import ChatBox from '../Chat'
import GetHelp from '../GetHelp'
import TripTable from '../TripTable'


// import MainScreen from 

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const TabNavigator = createBottomTabNavigator({
  MyTrips: {
    screen: Home,
    // headerTitle: "My Trips"
  },
  Schedule: {screen: Schedule},
  ChatBox: {screen: ChatBox},
  GetHelp: {screen: GetHelp}
},{tabBarOptions:{
  showLabel: false,
  style: {
    backgroundColor: '#ffca28',
  },
},
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes
    [navigation.state.index];
    return{
      headerTitle: routeName
    }
  }
},
);


const MainTabNavigator = createStackNavigator({
  TabNavigator: {
    screen: TabNavigator,
  },TripTable:{
    screen: TripTable,
  },
},{
  defaultNavigationOptions: ({navigation}) => {
    return {
      headerRight: <Text>hi</Text>,
      headerTintColor: '#2b2b2b',
      headerStyle:{
        backgroundColor: '#ffca28',
      },
    }
  }
}
);


const MainNavigation = createAppContainer(MainTabNavigator);

export default MainNavigation;