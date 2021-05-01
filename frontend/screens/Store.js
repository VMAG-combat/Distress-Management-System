import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  View,
  Image,
  ImageBackground,
  Platform,
  Alert,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import deviceStorage from '../services/deviceStorage.js'; 

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Product from './Product';
import Cart from './Cart';


function ProductTab({navigation, route}){
  console.log(route)
   return (
    <Product navigation={navigation} route={route}/>
  );
}

function CartTab({navigation, route}){
  return (
   <Cart navigation={navigation} route={route}/>
 );
}


const Tab = createMaterialTopTabNavigator();

class Store extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userId: ''
    }
    
  }

  componentDidMount() {
    deviceStorage.getId().then((userId) => {
      this.setState({
        userId: userId
      })
    })
  }
  render() {
    const {userId} = this.state;
    // const {userId} = async () => {var id= await deviceStorage.getId(); return id;}
    console.log("I have the userId" ,userId);
    return (
      <Tab.Navigator>
        <Tab.Screen name="Store" component={ProductTab} initialParams={{'userId':userId}}/>
        <Tab.Screen name="Cart" component={CartTab} initialParams={{'userId':userId}}/>
      </Tab.Navigator>
    );
  }
}

export default Store;