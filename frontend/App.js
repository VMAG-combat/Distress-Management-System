import React, {useState} from "react";
import { Image,View, StatusBar } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";

import Screens from './navigation/Screens';
export default class App extends React.Component {
  render() {
    return (
      
          <NavigationContainer>
            <Screens/>
                        
          </NavigationContainer>
      
          
    );
  }
}