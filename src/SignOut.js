import React, {Component} from 'react';
import {Alert, StyleSheet, TouchableHighlight, Image, ScrollView} from 'react-native';
import { Container, Content, Text, Button,Icon , Form } from 'native-base';
import firebase from 'react-native-firebase'

// import Icon from 'react-native-vector-icons/FontAwesome';



export default class GetHelp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkGuide: false,
      showFormTerminate: false,
      idGroup: '',
    };
    this.areyouGuide = this.areyouGuide.bind(this)
    this.terminateTrip = this.terminateTrip.bind(this)
    
  }

  componentWillMount(){
    this.areyouGuide()
  }
  static navigationOptions = {
    tabBarIcon: ({focused}) => (
      <Icon name="md-person"  />
    ),
    
    
  }
  onSignOutPress = () => {
    firebase.auth().signOut()
  }

  async areyouGuide(){
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
            console.log('guide' + this.state.checkGuide)
          }
          dbGuide.child('activeTrip/idGroup').once("value")
          .then(snapshot => {
            if(snapshot.val() != null){
              this.setState({
                idGroup: snapshot.val()
              })
              console.log(this.state.idGroup)
            }
          })
        })
    }
  }

  terminateTrip(){
    if(firebase.auth().currentUser != null && this.state.checkGuide){
      let dbCompany = firebase.database().ref('Companies/00001/activeTrip/' + this.state.idGroup)
      dbCompany.remove()
      let dbGuide = firebase.database().ref('Guides/' + firebase.auth().currentUser.uid)
      dbGuide.child('oldTrip').push({
        idGroup: this.state.idGroup
      })
      dbGuide.child('activeTrip/idGroup').remove()
    
      let dbUser = firebase.database().ref('Users/')
      dbUser.once("value")
        .then(snapshot => {
          // console.log(snapshot.val())
          Object.values(snapshot.val()).map((item, index) => {
            console.log(item.activeTrip)
            if(item.activeTrip != null){
              console.log(item.activeTrip.idGroup)
              if(item.activeTrip.idGroup == this.state.idGroup){
                dbUser.child(item.useruid + '/oldTrip').push({
                  idGroup: this.state.idGroup
                })
                dbUser.child(item.useruid + '/activeTrip/idGroup').remove()
              }
            }
        })
      })
      this.setState({
        showFormTerminate: false,
        // alreadyDelete: true,
      })
      
    }
  }
  render(){
    console.log(firebase.auth().currentUser.email)
    return(
      <Container>
       
        <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 , alignItems: 'center'}}>

        {
          this.state.checkGuide &&
          <Form style={{marginBottom: '10%'}}>
          <Button onPress={() => Alert.alert('Terminate', 'Are you sure to terminate this trip ?', [{text: 'Ok', onPress: () => this.terminateTrip()},{text: 'Cancel'}])} danger style={{alignSelf: 'center'}}>
            <Text>Terminate</Text>
          </Button>
          <Text style={{alignSelf: 'center', marginTop: '5%'}}>Click the button to terminate this trip.</Text>
          </Form>

        }
        
          <Button dark style={{alignSelf: 'center'}} onPress={this.onSignOutPress}><Text> Sign Out </Text></Button>
          <Text style={{paddingTop: '5%'}}>{firebase.auth().currentUser.email}</Text>

        </Content>
        
      </Container>
    );
  }
  
}
