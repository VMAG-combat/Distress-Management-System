import React from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { Block, Button,  Text, theme } from "galio-framework";
import Register from "./Register";
import Pro from "./Pro";
const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import Otp from "./Otp";
const Stack = createStackNavigator();
function  StartStack({navigation}) {
  return (
    
    <Block flex style={styles.container}>
    <StatusBar hidden />
    <Block flex center>
    <ImageBackground
        source={Images.Onboarding}
        style={{ height, width, zIndex: 1 }}
      />
    </Block>
    <Block center>
      <Image source={Images.LogoOnboarding} style={styles.logo} />
    </Block>
    <Block flex space="between" style={styles.padded}>
        <Block flex space="around" style={{ zIndex: 2 }}>
          <Block style={styles.title}>
            <Block>
              <Text color="white" size={50}>
                Spreading
              </Text>
            </Block>
            <Block>
              <Text color="white" size={50}>
                Happiness!!!
              </Text>
            </Block>
            <Block style={styles.subTitle}>
              <Text color="white" size={15}>
                Your own distress management system.
              </Text>
            </Block>
          </Block>
          <Block center>
          
            <Button
              style={styles.button}
              color={argonTheme.COLORS.SECONDARY}
              onPress={() => navigation.navigate('Login')}
              textStyle={{ color: argonTheme.COLORS.BLACK, fontSize:18 }}
            >
              Get Started
            </Button>
            
          </Block>
      </Block>
    </Block>
  </Block>
    
  );
}

function LoginStack({navigation}){
  return(
    <Login navigation={navigation}/>
  );
}
function RegisterStack({navigation}){
  return(
    <Register navigation={navigation}/>
  );
}
function OtpStack({navigation,route}){
  return(
    <Otp navigation={navigation} route={route}/>
  );
}
class Onboarding extends React.Component {
 
  render() {
    const { navigation } = this.props;
    return (
      
        <Stack.Navigator initialRouteName="Start"
        screenOptions={{
          headerShown: false
        }}
        >
    <Stack.Screen name='Start' component={StartStack} />
      <Stack.Screen name='Login' component={LoginStack} 
      options={
        {
          newJWT: this.props.newJWT,
        }}/>
      <Stack.Screen name='Register' component={RegisterStack} options={
        {
          newJWT: this.props.newJWT,
        }}/>
      <Stack.Screen name='Otp' component={OtpStack} options={
        {
          newJWT: this.props.newJWT,
        }} />
    </Stack.Navigator>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  logo: {
    width: 200,
    height: 200,
    zIndex: 2,
    position: 'relative',
    marginTop: '-70%'
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  }
});

export default Onboarding;
