import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import { Container, Header, Content, Button, Text, Card, CardItem, Thumbnail, Body, Left, Icon } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';


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
      latitude: 0,
      longitude: 0,
      error: null
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
        }}
      >
        <Marker
        coordinate={this.state}
        title="my location"
        description="im here"
        />
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
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });

