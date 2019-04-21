import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import { Button, Icon} from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import firebase from 'react-native-firebase'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class Map extends Component {
  static navigationOptions = {
      tabBarIcon: ({focused}) => (
        <Icon name="chatboxes"  />
      ),
      
    }

  constructor(props){
    super(props);
    this.state = {
      dataGPS: null,
      latitude: 0,
      longitude: 0,
      error: null
    }
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.readGPS = this.readGPS.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentWillMount(){
    this.readGPS()
  }

  forceUpdateHandler(){
    this.readGPS()
    this.forceUpdate()
  };

  readGPS(){
    if(firebase.auth().currentUser != null){
      var dbGuide = firebase.database().ref("Guides/" + firebase.auth().currentUser.uid + '/activeTrip/idGroup')
      dbGuide.keepSynced(true)
            dbGuide.once("value")
              .then(snapshot => {
                // console.log(snapshot.val())
                if(snapshot.val() !== null){
                  console.log(snapshot.val())
                  var dbGroup = firebase.database().ref("Groups/" + snapshot.val() + '/gps' )
                    dbGroup.once("value")
                      .then(snapshot => {
                      console.log(Object.values(snapshot.val()))
                      this.setState({
                        dataGPS: Object.values(snapshot.val())
                      })
                      console.log(this.state.dataGPS)
                      })
                }
              })
    }
  }
  
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        })
        console.log(this.state.latitude, this.state.longitude)
      }, error => this.setState({ error: error.message }),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
        <Button transparent dark style={{alignItems: 'flex-end'}} onPress= {this.forceUpdateHandler}><Icon name="ios-refresh"/></Button>

        {
          this.state.dataGPS && this.state.dataGPS.map((item, index) => {
            return(
              <Marker key={index}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title= {item.email}
              />
            )
          })
        }
          
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 'auto',
    width: 'auto',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });

