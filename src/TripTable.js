import React, { Component } from 'react';
import { Image, ScrollView } from 'react-native';
import { Container, Content, Tab, Tabs, ScrollableTab, Text, Card, CardItem, Left, Body } from 'native-base';
import firebase from 'react-native-firebase'

export default class TabsScrollableExample extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('nameTrip', 'Name Trip'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      dataTrip: [],
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
    var arr =[]
    const { navigation } = this.props;
    const idGroup = navigation.getParam('idGroup', 'no name');
    // console.log(idGroup)
    let dbGroup = firebase.database().ref("Groups/" + idGroup + "/Detail")
    this.buildOptionsTime().map(time => {
      dbGroup.once("value")
        .then(snapshot => {
          // console.log(Object.values(snapshot.val()))
          Object.values(snapshot.val()).map(item => {
            if(item.startTime == time){
              // console.log(item.startTime)
              arr.push(item)
            }
          })
          this.setState({
            dataTrip: arr
          })
        })
    })
  }
  buidDuration(){
    const arr = []
    const { navigation } = this.props;
    const duration = navigation.getParam('duration', '1');
    for(let i = 1 ; i <= duration ; i++){
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
    arr.push('24:00')
    console.log(arr)
    return arr
}

  render() {
    const { navigation } = this.props;
    const nameTrip = navigation.getParam('nameTrip', 'no');
    console.log(nameTrip)
    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1 }}>
            <Tabs renderTabBar={()=> <ScrollableTab />}>
            {
              this.buidDuration().map(day => {
                
                return(
                  <Tab key={day} heading = {'Day '+ day } >
                  <ScrollView style={{ flex: 1 }}>
                    {
                    
                    this.state.dataTrip && this.state.dataTrip.map((item, index) => {
                      if(day == item.bookDay){
                        console.log(item.bookDay, day)
                        return(
                          <Card key={index}>
                            <CardItem>
                              <Left>
                                <Body>
                                  <Text>{item.location}</Text>
                                  <Text style={{paddingTop: '2%'}} note>{item.startTime} - {item.endTime}</Text>
                                </Body>
                              </Left>
                            </CardItem>
                            <CardItem>
                              <Body>
                                <Image source={{uri: item.picture || 'https://firebasestorage.googleapis.com/v0/b/project-190f0.appspot.com/o/b3b18c6fce4e1f9b287982184fc84e46.png?alt=media&token=eca26aa1-06bf-4374-b6ec-725cee8f8a63'}} 
                                style={{height: 200, width: 350,alignSelf: 'center'}}/>
                                <Text style={{paddingTop:'5%'}}>
                                  {item.description}
                                </Text>
                              </Body>
                            </CardItem>
                          </Card>
                        )
                      }
                    })
                  }  
                </ScrollView>                
              </Tab>
              )
            })
          }
          </Tabs>
        </Content>
      </Container>
    );
  }
}