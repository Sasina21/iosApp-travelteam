import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableHighlight, Image, ScrollView} from 'react-native';
import { Container, Content, Text, Button,Icon } from 'native-base';
import firebase from 'react-native-firebase'

// import Icon from 'react-native-vector-icons/FontAwesome';



export default class GetHelp extends Component {
  static navigationOptions = {
    tabBarIcon: ({focused}) => (
      <Icon name="md-person"  />
    ),
    
    
  }
  onSignOutPress = () => {
    firebase.auth().signOut()
  }
  render(){
    console.log(firebase.auth().currentUser.email)
    return(
      <Container>
       
        <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 , alignItems: 'center'}}>
        <Text style={{paddingBottom: '5%'}}>{firebase.auth().currentUser.displayName}</Text>
        <Text style={{paddingBottom: '5%'}}>{firebase.auth().currentUser.email}</Text>
        <Button dark style={{alignSelf: 'center'}} onPress={this.onSignOutPress}><Text> Sign Out </Text></Button>
        
        {/* <Button danger style={{alignSelf: 'center'}}>
            <Text>Help Me!</Text>
        </Button> */}

        {/* <Text style={{alignSelf: 'center', marginTop: '5%'}}>If you get lost ,Guide will know your GPS</Text> */}

        </Content>
        
      </Container>
    );
  }
  
}
