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
      linegroupURL: '',
      activeGroup: '',

    };
    this.areyouGuide = this.areyouGuide.bind(this)
    
  }

  componentWillMount(){
    this.areyouGuide()
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
                  var dbGroup = firebase.database().ref("Groups/" + snapshot.val().idGroup )
                  dbGroup.update({
                    lineURL: this.state.lineURL
                  })
                }
              })
    }else if(firebase.auth().currentUser != null){
      var dbUser= await firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/activeTrip')
      // dbUser.keepSynced(true)
            await dbUser.once("value")
              .then(snapshot => {
                // console.log(snapshot.val())
                if(snapshot.val() !== null){
                  console.log(snapshot.val().idGroup)
                  var dbGroup = firebase.database().ref("Groups/" + snapshot.val().idGroup )
                  dbGroup.update({
                    lineURL: this.state.lineURL
                  })
                }
              })
    }
}

  
  render(){
    const {navigate} = this.props.navigation;
    return(
      <Container>
        <Content Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
          <Form>
            <Item floatingLabel>
              <Label>Line Group</Label>
              <Input onChangeText={(text) =>{this.setState({ lineURL : text })}} autoCorrect={false} autoCapitalize='none' />
            </Item>
            <Button style={{marginTop: '3%', alignSelf: 'center'}} onPress={this.saveURL} dark><Text> OK </Text></Button>
          </Form>
          <Button style={{alignSelf: 'center'}} transparent onPress={() => Linking.openURL(this.state.lineURL)}>
            <Text>{this.state.lineURL}</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

