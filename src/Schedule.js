import React, {Component} from 'react';
import {Platform, StyleSheet, View, TouchableHighlight, Image, ScrollView} from 'react-native';
import { Container, Text, Content, Icon, Tabs, Tab, ScrollableTab} from 'native-base';
import firebase from 'react-native-firebase'


export default class Schedule extends Component {
  
  static navigationOptions = {
    tabBarIcon: ({focused}) => (
      <Icon name="alarm"  color={focused ? 'white' : 'black'}/>
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      dataTrip: [],
      idGroup: '',
      duration: '',
    };
    this.buidDuration = this.buidDuration.bind(this)
    this.buildOptionsTime = this.buildOptionsTime.bind(this)
    this.readData = this.readData.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
  }

  componentWillMount(){
    this.readData()
    this.buidDuration()
    this.buildOptionsTime()
  }

  readData(){
    let useruid = firebase.auth().currentUser.uid
    let dbUser = firebase.database().ref("Users/" + useruid + '/activeTrip')
    dbUser.once("value")
      .then(snapshot => {
        this.setState({
          idGroup: Object.values(snapshot.val())
        })
        // console.log(this.state.idGroup)
        let dbGroup = firebase.database().ref("Groups/" + this.state.idGroup)
        dbGroup.once("value")
          .then(snapshot => {
            this.setState({
              duration: snapshot.val().duration
            })
            console.log(snapshot.val().duration)
          })
        dbGroup.child('/Detail').once("value")
          .then(snapshot => {
            this.setState({
              dataTrip: Object.values(snapshot.val())
            })
            console.log(this.state.dataTrip)
          })
      })
  }
  buidDuration(){
    const arr = []
    const { navigation } = this.props;
    const duration = navigation.getParam('duration', '1');
    for(let i = 1 ; i <= this.state.duration ; i++){
      arr.push(i)
    }
    console.log(arr)
    return arr
  }

  buildOptionsTime() {
    const arr = [];
    for (let i = 6; i <= 23 ; i++) {
        arr.push(i+':00 ')
        arr.push(i+':30 ')
    }
    arr.push('0:00')
    console.log(arr)
    return arr
}
  render(){
    return(
      <Container>
      <Content contentContainerStyle={{ flex: 1 }}>
        <Tabs renderTabBar={()=> <ScrollableTab />}>
            {
              this.buidDuration().map(day => {
                
                return(
                  <Tab key={day} heading = {'Day '+ day } >
                  {
                    
                    this.state.dataTrip && this.state.dataTrip.map((item, index) => {
                      if(day == item.bookDay){
                        console.log(item.bookDay, day)
                        return (
                          <View key={index} style={{margin: '4%'}}>
                            <Text style={{fontSize: 21}}>{item.location}</Text>
                            <Text style={styles.text}>Start time : {item.startTime}</Text>
                            <Text style={styles.text}>End time : {item.endTime}</Text>
                            <View style={{ borderBottomColor: 'black',borderBottomWidth: 1, paddingTop: '5%'}}/>
                          </View>
                        )
                      }
                    })

                  }                  
                  </Tab>
                )
              })
            }
            </Tabs>
        
    
        {/* <Content style={{flex:1 ,marginLeft: "5%", marginTop : "5%"}}>
          <Text style={{fontSize: 21}}>Harajuku</Text>
          
          <Text style={styles.text}>Start time : 12:00</Text>
          <Text style={styles.text}>End time : 13:00</Text>

          <View style={{ borderBottomColor: 'black',borderBottomWidth: 1, paddingTop: '5%'}}/>
          
          <Text style={styles.location}>Harajuku</Text>
          <Text style={styles.text}>Start time : 12:00 </Text>
          <Text style={styles.text}>End time : 13:00 </Text>
        </Content> */}
        </Content>
      </Container>
    );
  }
  
}
const styles = StyleSheet.create({
  location: {
    color: "black",
    fontSize: 21,
    marginTop: 20,
  },
  text:{
    color: "black",
    fontSize: 18,
    marginTop: 9,
  },
  icon: {
    color: "black",
    // fontSize: 80,
    
  },
});
