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

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import {Avatar, Card, Title, Paragraph} from 'react-native-paper';
const { width, height } = Dimensions.get("screen");
import axios from 'axios';
import ENV from '../env.';
import deviceStorage from '../services/deviceStorage.js';

const thumbMeasure = (width - 48 - 32) / 3;


class ItemsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      products: '',
      message:'',
      isRefreshing: false,
    }  
  }

  async componentDidMount() {
    this.setState({
      isRefreshing: true,
    })
    await deviceStorage.getId().then((userId) => {
      this.setState({
        userId: userId,
      })
    })

    await axios({
      method: 'GET',
      url: `${ENV.apiUrl}/store/getAllProducts/`,
    }).then((response) => {
      this.setState({
        products: response.data.products,
        message: response.data.error,
        isRefreshing: false,
      });
      
    }).catch((error) => {
      this.setState({
        message: 'Error retrieving data',
        isRefreshing: false,
      });
    });
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
  };
  }

  addToCart = async (val) => {
    const productId = val;
    await axios({
      method: "POST",
      url: `${ENV.apiUrl}/store/createOrder/` +productId +`/` +this.state.userId,
    }).then(res => {
        if (res.data.error == "") {
          Alert.alert("Product successfully added to cart");
        } else if(res.data.error == "Order already present") {
          Alert.alert("Product already present in cart.")
        } else {
          Alert.alert("Something went wrong. Please Try again");
        }
    });
  }

  render() {
    const {products, message, isRefreshing} = this.state;
    return (
      <Block flex style={styles.group}>
        {!isRefreshing && <Block flex>
          <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <FlatList
              keyExtractor={(item) => item.id}
              data={products}
              renderItem={({ item }) => (
                <Card style={styles.itemCard}>
                  <Card.Title title={item.title} />
                  <Card.Cover style={styles.cardImage} source={{uri: item.image}} />
                  <Card.Content>
                    <Paragraph style={styles.cardContent}>{item.content}</Paragraph>
                    <Paragraph style={styles.itemPrice}>{"Price: " +item.price}</Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button style={styles.cardBtn} color='error' onPress={() => this.addToCart(item.id)}>Add to cart</Button>
                    <Button onPress={() => this.props.navigation.navigate('Reviews', item)} style={styles.cardBtn} color='primary'>See reviews</Button>
                  </Card.Actions>
                </Card>
              )}
            />
          </Block>
        </Block>}
        {isRefreshing && <View style={{fontWeight: 'bold', alignSelf: "center"}}><Text style={{fontSize: 18}}>Page is Refreshing ....</Text></View>}
      </Block>
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


export default ItemsScreen;