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
  Button,
  Alert,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import deviceStorage from '../services/deviceStorage.js'; 

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Product from './Product';
import Cart from './Cart';
import Order from './MyOrders';


export const Store = (props) => {
  const [chosenTab, setChosenTab] = useState('tab0');
  const[userId, setUserId] = useState();
  const colors = ['#0D47A1', '#64B5F6'];
  deviceStorage.getId().then((userId)=>{
    setUserId(userId)
  })

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center'}}>
        <View style={{flex: 1, alignSelf: 'stretch'}}>
          <Button
          color = {chosenTab == 'tab0' ? colors[0] : colors[1]}
          onPress={() => setChosenTab('tab0')} 
          title='store'/>
        </View>
        <View style={{flex: 1, alignSelf: 'stretch'}}>
          <Button 
          color = {chosenTab == 'tab1' ? colors[0] : colors[1]}
          onPress={() => setChosenTab('tab1')} 
          title='cart' />
        </View>
        <View style={{flex: 1, alignSelf: 'stretch'}}>
          <Button 
          color = {chosenTab == 'tab2' ? colors[0] : colors[1]}
          onPress={() => setChosenTab('tab2')} 
          title='My Orders' />
        </View>
      </View>
      {chosenTab == 'tab0' ? (
        <Product userId={userId} />
      ) : chosenTab == 'tab1' ? (
        <Cart userId={userId} />
        ) : <Order userId={userId} />}
      
    </View>
  )

}

export default Store;