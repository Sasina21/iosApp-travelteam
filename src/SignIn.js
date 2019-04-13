import React, {Component} from 'react';
import {Platform, Image, View} from 'react-native';
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


export default class SignIn extends Component {
  static navigationOptions = {
    header: null,
    };

  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      selected2: undefined,
      isAuthenticated: false,
      typedEmail: '',
      typedPassword: '',
      user: null,
      showStatus: '',
      errorStatus: '',
    };
  }
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
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

  onRegister = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword)
    .then((signInUser) => {
      this.setState({ user: signInUser })
      console.log(`Register with user : ${JSON.stringify(signInUser.toJSON())}`)
    }).catch((error) => {
      console.log(`Register fail with error : ${error}`)
      this.setState({
        errorStatus: `${error}`
      })
      const errorword = this.state.errorStatus.split(':')
      if(errorword[0] == 'Error'){
        this.setState({
          showStatus: errorword[1]
        })
      }
    })
  }

  onSignIn = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword)
    .then((signInUser) => {
      this.setState({user: signInUser})
      console.log(`Register with user : ${JSON.stringify(signInUser.toJSON())}`)
    }).catch((error) => {
      console.log(`Register fail with error : ${error}`)
    })
  }
  render() {
    return (
    <Container style={{backgroundColor:'#ffca28'}}>
        <Content style={{marginTop: '40%', flex: 1}}>
        <Image fontSize source={{uri: 'https://firebasestorage.googleapis.com/v0/b/project-190f0.appspot.com/o/Heartbeat-III.png?alt=media&token=a517cee4-b564-4713-bd18-d48970959183'}} 
        style={{ alignSelf:'center' ,width: 150, height: 150, flex: 1}}/>
        <Text style={{paddingTop: "1%", alignSelf: 'center', fontWeight:'700', fontSize:20}}>TRAVEL  IS  LIFE</Text>
        <Text style={{paddingBottom: "5%", alignSelf: 'center'}}>Let's create the life you love.</Text>
        
          <Form>
            <Item picker style={{borderColor: '#A9A9A9'}} >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined}}
                placeholder="Who are you ?"
                placeholderStyle={{ color: "#2F4F4F" }}
                placeholderIconColor="#2F4F4F"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}>

                <Picker.Item label="Tourist" value="Users" />
                <Picker.Item label="Guide" value="Guides" />
              </Picker>
            </Item>

            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="E-mail" autoCorrect={false} autoCapitalize='none' onChangeText={(text) =>{this.setState({ typedEmail : text })}} />
            </Item>

            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="Password" autoCorrect={false} autoCapitalize='none' secureTextEntry={true} onChangeText={(text) =>{this.setState({ typedPassword : text ,showStatus: ''})}} />
            </Item>
            
            <Text style={{color: 'red', paddingTop:"4%", textAlign:'left', fontSize:13}} >{this.state.showStatus}</Text>

            <View style={{margin:'3%'}}>
              <Button block style={{marginBottom: '2%', backgroundColor: '#E1AD01'}} onPress={this.onSignIn} ><Text> Sign In </Text></Button>
              <Button block style={{backgroundColor: '#281e5d'}}onPress={this.onRegister} dark><Text> Sign Up </Text></Button>
            </View>
            
            

          </Form>
        </Content>
    </Container>
    );
  }
}

