import React, {Component} from 'react';
import {Platform, ScrollView, View, RefreshControl } from 'react-native';
import { Container, Header, Content, Button, Text, Card, CardItem, Thumbnail, Body, Left, Icon, List } from 'native-base';
import firebase from 'react-native-firebase'
import { FlatList } from 'react-native-gesture-handler';

// import HeaderBar from './HeaderBar'
// import FooterBar from './FooterBar'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTrip: null,
      oldDataTrip: null,
      idOldTrip: null,
      checkGuide: null,
    };
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  forceUpdateHandler(){
    this.componentDidMount()
    this.forceUpdate();
  };

  static navigationOptions = {
      tabBarIcon: (
       <Icon name="home" />
      ),
      
    }

    componentDidMount() {
      this.readOldData()
      this.readActiveData()
    }
    componentWillMount() {
      this.areyouGuide()
    }

    areyouGuide(){
      if(firebase.auth().currentUser != null){
        console.log('tesst')
        let dbGuide = firebase.database().ref('Guides/' + firebase.auth().currentUser.uid)
        dbGuide.keepSynced(true)
        dbGuide.once("value")
          .then(snapshot => {
            console.log(snapshot.val())
            if(snapshot.val()!== null){
              console.log('Im Guide')
              let dbGuide = firebase.database().ref('Guides/' + firebase.auth().currentUser.uid + '/activeTrip')
              dbGuide.update({
                id: 'id'
              })
              this.setState({
                checkGuide: true
              })
              this.readActiveData()
              this.readOldData()
            }else{
              console.log('Im user')
              let dbUser = firebase.database().ref('Users/' + firebase.auth().currentUser.uid)
              dbUser.keepSynced(true)
              dbUser.update({
                useruid: firebase.auth().currentUser.uid,
                email: firebase.auth().currentUser.email,
              })
              dbUser.child('/activeTrip').update({
                id: 'id'
              })
              this.setState({
                checkGuide: false
              })
              this.readActiveData()
              this.readOldData()
            }
          })
      }
    }

    async readActiveData(){
      var arr = []
      if(firebase.auth().currentUser != null && this.state.checkGuide){
        var dbGuide = firebase.database().ref("Guides/" + firebase.auth().currentUser.uid)
        dbGuide.keepSynced(true)
          dbGuide.child('/activeTrip').once("value")
            .then(snapshot => {
              // console.log(snapshot.val())
              if(snapshot.val() !== null){
                console.log(snapshot.val().idGroup)
                var dbGroup = firebase.database().ref("Groups/" + snapshot.val().idGroup )
                dbGroup.keepSynced(true)
                  dbGroup.once("value")
                    .then(snapshot => {
                    this.setState({
                      dataTrip: snapshot.val()
                    })
                    console.log(this.state.dataTrip)
                    })
              }
            })
      }else if(firebase.auth().currentUser != null){
        var dbUser = firebase.database().ref("Users/" + firebase.auth().currentUser.uid)
        dbUser.keepSynced(true)
          dbUser.child('/activeTrip').once("value")
            .then(snapshot => {
              // console.log(snapshot.val())
              if(snapshot.val() !== null){
                console.log(snapshot.val().idGroup)
                var dbGroup = firebase.database().ref("Groups/" + snapshot.val().idGroup )
                dbGroup.keepSynced(true)
                  dbGroup.once("value")
                    .then(snapshot => {
                    this.setState({
                      dataTrip: snapshot.val()
                    })
                    console.log(this.state.dataTrip)
                    })
              }
            })
      }
  }

  async readOldData(){
    var arr = []
    if(firebase.auth().currentUser != null && this.state.checkGuide){
      var dbGuide= firebase.database().ref("Guides/" + firebase.auth().currentUser.uid + '/oldTrip')
      dbGuide.keepSynced(true)
      dbGuide.once("value")
      .then(snapshot => {
        if(snapshot.val() !== null){
          console.log(Object.values(snapshot.val()))
          Object.values(snapshot.val()).map((item,index) => {
            console.log(item.idGroup)
            var dbGroup = firebase.database().ref("Groups/" + item.idGroup )
            dbGroup.keepSynced(true)
              dbGroup.once("value")
                .then(snapshot => {
                  arr.push(snapshot.val())
                })
          })
          this.setState({
            oldDataTrip: arr
          })
          console.log(this.state.oldDataTrip)
        }
      })
    }else if(firebase.auth().currentUser != null){
      var dbUser= firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/oldTrip')
      dbUser.keepSynced(true)
        dbUser.once("value")
        .then(snapshot => {
          if(snapshot.val() !== null){
            console.log(Object.values(snapshot.val()))
            Object.values(snapshot.val()).map((item,index) => {
              console.log(item.idGroup)
              var dbGroup = firebase.database().ref("Groups/" + item.idGroup )
              dbGroup.keepSynced(true)
                dbGroup.once("value")
                  .then(snapshot => {
                    arr.push(snapshot.val())
                  })
            })
            this.setState({
              oldDataTrip: arr
            })
            console.log(this.state.oldDataTrip)
          }
        })
    }
  }

  

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Container>
        <Button transparent dark style={{alignSelf: 'flex-end'}} onPress= {this.forceUpdateHandler}><Icon name="ios-refresh" /></Button>
        <ScrollView style={{ flex: 1 }} >
          { 
              this.state.dataTrip && 
              (<Card>
                <CardItem button onPress={() => navigate('TripTable', 
                                                {idGroup : this.state.dataTrip.idGroup, 
                                                nameTrip: this.state.dataTrip.nameTrip,
                                                duration : this.state.dataTrip.duration
                                                })}>
                  <Left>
                    <Thumbnail source={{uri: this.state.dataTrip.picfirst}} />
                    <Body>
                      <Text>{this.state.dataTrip.nameTrip}</Text>
                      <Text note>{this.state.dataTrip.country}</Text>
                      <Text note>{this.state.dataTrip.duration} Days</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>)
                
          }

          <View style={{marginTop:'7%' ,flex: 1}}>
          {
            this.state.oldDataTrip && <Text style={{fontSize:13}}>Old Trips</Text>
          }
          {
            this.state.oldDataTrip && this.state.oldDataTrip.map((item, index) => {
              return(
                <Card key={index}>
                  <CardItem button onPress={() => navigate('TripTable', 
                                              {idGroup : item.idGroup, 
                                              nameTrip: item.nameTrip,
                                              duration : item.duration
                                              })}>
                    <Left>
                      <Thumbnail source={{uri: item.picfirst}} />
                      <Body>
                        <Text>{item.nameTrip}</Text>
                        <Text note>{item.country}</Text>
                        <Text note>{item.duration} Days</Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              )
            })
          }
          </View> 
        </ScrollView>
      </Container>
    );
  }
}
