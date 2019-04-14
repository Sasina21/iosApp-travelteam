import React, {Component} from 'react';
import {Platform, Image, View, Alert} from 'react-native';
import { Container, Button, Content, Form, Item, Input, Picker, Icon, Text } from 'native-base';
import firebase from 'react-native-firebase'

// import HeaderBar from './HeaderBar'
// import FooterBar from './FooterBar'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class SignUp extends Component {
  

  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      isAuthenticated: false,
      typedEmail: '',
    //   typedName: '',
      typedPassword: '',
      passwordConfirm: '',
      user: null,
    };
  }

  onRegister = () => {
    if(this.state.typedPassword !== this.state.passwordConfirm){
        Alert.alert("Passwords do not match")
        return
    }
    firebase.auth().createUserWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword)
    .then((signInUser) => {
      this.setState({ user: signInUser })
      Alert.alert("success")
      // console.log(`Register with user : ${JSON.stringify(signInUser.toJSON())}`)
    }).catch((error) => {
      console.log(`Register fail with error : ${error}`)
      Alert.alert(error.message)
    })
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
    <Container style={{backgroundColor:'#ffca28'}}>
        <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
          <Form>

            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="E-mail" autoCorrect={false} autoCapitalize='none' onChangeText={(text) =>{this.setState({ typedEmail : text })}} />
            </Item>

            {/* <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="Display Name" autoCorrect={false} autoCapitalize='none' onChangeText={(text) =>{this.setState({ typedName : text })}} />
            </Item> */}

            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="Password" autoCorrect={false} autoCapitalize='none' secureTextEntry={true} onChangeText={(text) =>{this.setState({ typedPassword : text})}} />
            </Item>
            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="Password confirm" autoCorrect={false} autoCapitalize='none' secureTextEntry={true} onChangeText={(text) =>{this.setState({ passwordConfirm : text})}} />
            </Item>

            <View style={{margin:'3%'}}>
              <Button block style={{backgroundColor: '#281e5d'}}onPress={this.onRegister} dark><Text> Sign Up </Text></Button>
            </View>
            

          </Form>
        </Content>
    </Container>
    );
  }
}

