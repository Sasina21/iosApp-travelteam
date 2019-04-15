import React, {Component} from 'react';
import {Platform, Image, View, Alert} from 'react-native';
import { Container, Button, Content, Form, Item, Input, Text } from 'native-base';
import firebase from 'react-native-firebase'

// import HeaderBar from './HeaderBar'
// import FooterBar from './FooterBar'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class ForgotPassword extends Component {

  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      typedEmail: '',
    };
  }


  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((changedUser) => {
      this.setState({ user: changedUser })
    })
  }
  
  componentWillUnmount(){
    if( this.unsubscriber ){
      this.unsubscriber()
    }
  }


  onReserPassword = () => {
    firebase.auth().sendPasswordResetEmail(this.state.typedEmail)
    .then(() => {
      Alert.alert("Password reset email has been sent.")
    }).catch((error) => {
    //   console.log(`Register fail with error : ${error}`)
      Alert.alert(error.message)
    })
  }
  render() {
    return (
    <Container style={{backgroundColor:'#ffca28'}}>
        <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
            <Form>

            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="E-mail" autoCorrect={false} autoCapitalize='none' onChangeText={(text) =>{this.setState({ typedEmail : text })}} />
            </Item>

            <View style={{margin:'3%'}}>
              <Button block style={{marginBottom: '2%', backgroundColor: '#E1AD01'}} onPress={this.onReserPassword} ><Text style={{color:'#2F4F4F'}}> Reset Password </Text></Button>
              
            </View>

          </Form>
        </Content>
    </Container>
    );
  }
}

