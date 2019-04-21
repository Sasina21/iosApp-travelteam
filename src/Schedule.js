import React, {Component} from 'react';
import {Linking, StyleSheet, View, TouchableHighlight, Image, ScrollView} from 'react-native';
import { Container, Text, Content, Icon, Form, Item, Label, Input, Button} from 'native-base';
import firebase from 'react-native-firebase'


export default class Schedule extends Component {
  
  static navigationOptions = {
    tabBarIcon: ({focused}) => (
      <Icon type="FontAwesome5" name="line"  color={focused ? 'white' : 'black'}/>
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      checkGuide: false,
      lineURL: '',
      readLineURL: '',
      activeGroup: '',

    };
    this.areyouGuide = this.areyouGuide.bind(this)
    this.saveURL = this.saveURL.bind(this)
    this.readURL = this.readURL.bind(this)
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    
  }

  componentWillMount(){
    this.areyouGuide()
  }

  componentDidMount(){
    this.readURL()
  }

  forceUpdateHandler(){
    this.componentDidMount()
    this.forceUpdate()
  };

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
            this.readURL()
            console.log('guide' + this.state.checkGuide)
          }         
        })
    }
  }

  readURL(){
    console.log(this.state.checkGuide)
    if(firebase.auth().currentUser.uid != null && this.state.checkGuide){
      console.log('hi')
      var dbGuide= firebase.database().ref("Guides/" + firebase.auth().currentUser.uid + '/activeTrip/idGroup')
          dbGuide.once("value")
              .then(snapshot => {
                console.log(snapshot.val())
                if(snapshot.val() !== null){
                  var dbGroup = firebase.database().ref("Groups/" + snapshot.val() + "/lineURL")
                  dbGroup.once("value")
                  .then(snapshot => {
                    this.setState({
                      readLineURL: snapshot.val()
                    })
                    console.log(this.state.readLineURL)
                  })
                }
              })
    }else if(firebase.auth().currentUser.uid != null){
      var dbGuide = firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/activeTrip/idGroup')
            dbGuide.once("value")
              .then(snapshot => {
                console.log(snapshot.val())
                if(snapshot.val() !== null){
                  var dbGroup = firebase.database().ref("Groups/" + snapshot.val() + "/lineURL")
                  dbGroup.once("value")
                  .then(snapshot => {
                    this.setState({
                      readLineURL: snapshot.val()
                    })
                  })
                }
              })
    }
  }

  async saveURL(){
    if(firebase.auth().currentUser != null && this.state.checkGuide){
      var dbGuide= await firebase.database().ref("Guides/" + firebase.auth().currentUser.uid + '/activeTrip')
            await dbGuide.once("value")
              .then(snapshot => {
                // console.log(snapshot.val())
                if(snapshot.val() !== null){
                  console.log(snapshot.val().idGroup)
                  var dbGroup = firebase.database().ref("Groups/" + snapshot.val().idGroup)
                  dbGroup.update({
                    lineURL: this.state.lineURL
                  })
                }
              })
    }
    this.readURL()
    this.forceUpdate()
}

  
  render(){
    const {navigate} = this.props.navigation;
    return(
      <Container>
        <Button transparent dark style={{alignSelf: 'flex-end'}} onPress= {this.forceUpdateHandler}><Icon name="ios-refresh" /></Button>
        <Content Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
        {
          this.state.checkGuide && 
          <Form>
          <Item floatingLabel>
            <Label>Line Group</Label>
            <Input onChangeText={(text) =>{this.setState({ lineURL : text })}} autoCorrect={false} autoCapitalize='none' />
          </Item>
          <Button style={{marginTop: '3%', alignSelf: 'center'}} onPress={this.saveURL} dark><Text> OK </Text></Button>
        </Form>

        }
         

          <Button style={{alignSelf: 'center'}} transparent onPress={() => Linking.openURL(this.state.readLineURL)}>
            <Text>{this.state.readLineURL}</Text>
          </Button>
          <Text style={{alignSelf: 'center', marginTop: '5%'}}>Click link to join line group.</Text>
        </Content>
      </Container>
    );
  }
}

