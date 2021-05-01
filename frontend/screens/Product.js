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
  Modal,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Header, Button, Input, Icon } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { MaterialIcons } from '@expo/vector-icons';
import {Avatar, Card, Title, Paragraph} from 'react-native-paper';
const { width, height } = Dimensions.get("screen");
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { set } from "react-native-reanimated";
import ItemsScreen from './ItemsScreen';
import ReviewsScreen from './ReviewsScreen';

const thumbMeasure = (width - 48 - 32) / 3;

export const ratingImages = {
  ratings: {
    '1': require('../assets/ratings/rating1.png'),
    '2': require('../assets/ratings/rating2.png'),
    '3': require('../assets/ratings/rating3.png'),
    '4': require('../assets/ratings/rating4.png'),
    '5': require('../assets/ratings/rating5.png'),
  }
};

const reviews = [
  {
    name: 'Sohan Sharma',
    content: 'Amazing product',
    key: '1',
    rating: '3',
  },
  {
    name: 'Mohini Yadav',
    content: 'Was very helpful',
    key: '2',
    rating: '4',
  },
]


function ReviewScreen({route, navigation}) {
  const userId = route.params.userId;
  const itemId = route.params.id;
  
  return (
    <ReviewsScreen navigation={navigation} itemId={itemId} userId={userId}/>
  )
}

function ItemScreen({route, navigation}) {
  const userId = route.params.userId;
  return (
    <ItemsScreen navigation={navigation} userId={userId}/>
  );  
}

const Stack = createStackNavigator();

class Product extends React.Component{
  
  render() {
    const userId = this.props.route.params.userId;
    console.log("prodo",)
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={{
            // headerStyle: {
            //   backgroundColor: '#3282b8',
            // },
            // headerTintColor: '#fff',
            // headerTitleStyle: {
            //   fontSize: 15,
            //   fontWeight: 'bold',
            // },
            headerShown: false
        }}
        >
          <Stack.Screen name="Products" component={ItemScreen} initialParams={{'userId':userId}}/>
          <Stack.Screen name="Reviews" component={ReviewScreen} initialParams={{'userId':userId}}/>
        </Stack.Navigator>
      </NavigationContainer> 
    ); 
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    paddingBottom: 20,
    color: argonTheme.COLORS.HEADER,
    justifyContent: 'center',
  },
  group: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: 38,
  },
  addBtn: {
    top: -18,
    right: 8,
    width: 85,
    height: 35,
  },
  itemCard: {
    marginBottom: 40,
  },
  cardContent: {
    paddingTop: 10,
    fontSize: 15,
  },
  cardBtn: {
    width: 130,
    height: 40,
    marginHorizontal: 20,
    fontSize: 15,
  },
  itemPrice: {
    fontWeight: 'bold',
    paddingTop: 5,
    fontSize: 17,
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  reviewInput: {
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  }
  
});

export default Product;