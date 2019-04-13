import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import { Container, Button, Content, Form, Item, Input, Picker, Icon, Text } from 'native-base';
import firebase from '../firebase'

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
    this.state = {
      selected2: undefined
    };
  }
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
  }
  render() {
    return (
    <Container style={{backgroundColor:'#ffca28'}}>
        <Content style={{marginTop: '60%'}}>
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
              <Input placeholder="Username" />
            </Item>

            <Item last style={{borderColor: '#A9A9A9'}}>
              <Input placeholder="Password" />
            </Item>
            
            <View style={{paddingTop: "20%", alignSelf: 'center', flexDirection:'row'}}>
              <Button style={{marginRight:'5%'}} dark><Text> Sign Up </Text></Button>
              <Button dark ><Text> Sign In </Text></Button>
            </View>
            

          </Form>
        </Content>
    </Container>
    );
  }
}

