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


export default class SignIn extends Component {
  static navigationOptions = {
    header: null,
    };

  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      selected1: undefined,
      typedEmail: '',
      typedPassword: '',
      user: null,
    };
  }
  onValueChange1(value: string) {
    this.setState({
      selected1: value
    });
  }

  // componentDidMount() {
  //   this.unsubscriber = firebase.auth().onAuthStateChanged((changedUser) => {
  //     this.setState({ user: changedUser })
  //   })
  // }
  
  // componentWillUnmount(){
  //   if( this.unsubscriber ){
  //     this.unsubscriber()
  //   }
  // }

  onSignIn = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword)
    .then((signInUser) => {
      this.setState({user: signInUser})
      console.log(this.state.user)
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
          <Icon style={{ alignSelf:'center' ,fontSize: 100}} name="md-pulse" />
          <Text style={{paddingTop: "1%", alignSelf: 'center', fontWeight:'700', fontSize:20, color:'#2b2b2b'}}>TRAVEL  IS  LIFE</Text>
          <Text style={{paddingBottom: "5%", alignSelf: 'center',color:'#2b2b2b'}}>Let's create the life you love.</Text>
          
          <Form>
            <Item picker style={{borderColor: '#A9A9A9'}} >
              <Picker id='typeUser'
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined}}
                placeholder="Who are you ?"
                placeholderStyle={{ color: "#2F4F4F" }}
                placeholderIconColor="#2F4F4F"
                selectedValue={this.state.selected1}
                onValueChange={this.onValueChange1.bind(this)}>

                <Picker.Item label="Tourist" value="Users" />
                <Picker.Item label="Guide" value="Guides" />
              </Picker>
            </Item>

            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="E-mail" autoCorrect={false} autoCapitalize='none' onChangeText={(text) =>{this.setState({ typedEmail : text })}} />
            </Item>

            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="Password" autoCorrect={false} autoCapitalize='none' secureTextEntry={true} onChangeText={(text) =>{this.setState({ typedPassword : text})}} />
            </Item>
            
            

            <View style={{margin:'3%'}}>
              <Button block style={{marginBottom: '2%', backgroundColor: '#E1AD01'}} onPress={this.onSignIn} ><Text style={{color:'#2F4F4F'}}> Sign In </Text></Button>
              <Button block style={{marginBottom: '2%', backgroundColor: '#281e5d'}} onPress={() => navigate('SignUp')} dark><Text> Sign Up </Text></Button>
              <Text onPress={() => navigate('ForgotPassword')} style={{color: '#808080', textDecorationLine:'underline'}}>Forgot password ?</Text>
            </View>
            
            

          </Form>
        </Content>
    </Container>
    );
  }
}

