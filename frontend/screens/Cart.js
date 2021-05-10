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
import { Header, Button, Input, Icon } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { MaterialIcons } from '@expo/vector-icons';
import {Avatar, Card, Title, Paragraph} from 'react-native-paper';
import axios from 'axios';
import ENV from '../env.';
import deviceStorage from '../services/deviceStorage.js';


class Cart extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      orders: "",
      subtotal: 0,
      message: "",
      userPoint: "",
      isRefreshing: false,
    }
    
  }

  async componentDidMount() {
    this._isMounted = true;
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
      url: `${ENV.apiUrl}/store/getAllOrders/` +this.state.userId,
    }).then((response) => {
      this.setState({
        orders: response.data.orders,
        message: response.data.error,
        subtotal: this.totalPrice(response.data.orders),
      });
    }).catch((error) => {
      this.setState({
        message: 'Error retrieving data',
      });
    });

    await axios({
      method: 'GET',
      url: `${ENV.apiUrl}/user/getprofile/` +this.state.userId,
    }).then((response) => {
      this.setState({
        userPoints: response.data.user.points,
        message: response.data.message,
        isRefreshing: false,
      });
    }).catch((error) => {
      this.setState({
        message: 'Error retrieving data',
        isRefreshing: false,
      });
    });

  }

  async getData(){
    this._isMounted = true;
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
      url: `${ENV.apiUrl}/store/getAllOrders/` +this.state.userId,
    }).then((response) => {
      this.setState({
        orders: response.data.orders,
        message: response.data.error,
        subtotal: this.totalPrice(response.data.orders),
      });
    }).catch((error) => {
      this.setState({
        message: 'Error retrieving data',
      });
    });

    await axios({
      method: 'GET',
      url: `${ENV.apiUrl}/user/getprofile/` +this.state.userId,
    }).then((response) => {
      this.setState({
        userPoints: response.data.user.points,
        message: response.data.message,
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
    this._isMounted = false;
  }

  totalPrice = (products) =>
  products.reduce(
    (sum, product) => sum + Number(product.quantity) * Number(product.price),
    0
  )

  deleteOrderBtn = async (val) => {
    const orderId = val;
    await axios({
      method: "POST",
      url: `${ENV.apiUrl}/store/deleteOrder/` +orderId,
    }).then(res => {
        if (res.data.message != '') {
          Alert.alert("Some Error occurred. Please try again")
        }
        this.getData();
    });
  }

  incQuantity = async (val) => {
    const orderId = val;
    await axios({
      method: "POST",
      url: `${ENV.apiUrl}/store/incOrderQuantity/` +orderId,
    }).then(res => {
        if (res.data.error != '') {
          Alert.alert(res.data.error);
        }
        this.getData();
    });
  }

  desQuantity = async (val) => {
    const orderId = val.id;
    const quantity = val.quantity;
    if (Number(quantity) == 1) {
      Alert.alert("Quantity must be at least 1. Delete the item if not needed");
    } else {
      await axios({
        method: "POST",
        url: `${ENV.apiUrl}/store/desOrderQuantity/` +orderId,
      }).then(res => {
          if (res.data.error != '') {
            Alert.alert(res.data.error)
          }
          this.getData();
      });
    }
  }

  makePayment = async () => {
    const userPoints = this.state.userPoints;
    const subtotal = this.state.subtotal;
    if (Number(userPoints) < Number(subtotal)) {
      Alert.alert("You don't have enough points to make this purchase.");
    } else {
      await axios({
        method: "POST",
        url: `${ENV.apiUrl}/user/deductPoints/` +this.state.userId,
        data: {deduct: subtotal}
      }).then(res => {
        if (res.data.error != '') {
          Alert.alert(res.data.error);
        }
      });
      var i = 0;
      const orders = this.state.orders;
      while (i < orders.length) {
        orders[i].status = 'paid';
        await axios({
          method: "POST",
          url: `${ENV.apiUrl}/store/orderStatusUpdate/` +orders[i].id,
          data: {order: orders[i]}
        }).then(res => {
            if (res.data.message != '') {
              Alert.alert(res.data.message)
            }
            i++;
        });
      }
      if (i == orders.length) {
        Alert.alert("Payment successfully. Thank you for purchasing from our store..")
        this.getData();
      }
    }
  }

  render() {
    const orders = this.state.orders;
    const subtotal = this.state.subtotal;
    const isRefreshing = this.state.isRefreshing;
    const userPoints = this.state.userPoints;
    return(
      <Block flex style={styles.group}>
        {!isRefreshing && orders.length != 0 &&
          <View style={{flexDirection: 'row', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 15, marginLeft: 15, marginRight: 15}}>
            <Text style={{fontSize: 18,
            fontWeight: 'bold',
            color: argonTheme.COLORS.HEADER}}>{"Subtotal: " +subtotal}</Text>
            <Text style={{fontSize: 18,
            fontWeight: 'bold',
            color: argonTheme.COLORS.HEADER}}>{"Your Points: " +userPoints}</Text>
          </View>
        }
        {!isRefreshing && orders.length != 0 && <View style={{alignSelf: 'center', marginTop: -15, marginBottom: 0}}>
          <Button color='default' onPress={() => this.makePayment()}>Proceed to Buy</Button>
        </View>}
        {!isRefreshing && orders.length != 0 && <Block flex>
          <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <FlatList
              keyExtractor={(item) => item.id}
              data={orders}
              renderItem={({ item }) => (
                <Card style={styles.itemCard}>
                  <Card.Title title={item.title} />
                  <Card.Cover style={styles.cardImage} source={{uri: item.image}} />
                  <Card.Content>
                    <Paragraph style={styles.itemPrice}>{"Price: " +item.price}</Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button style={styles.qtnBtn} color='warning'
                    onPress={() => this.desQuantity(item)}>-</Button>
                    <Text style={{fontSize: 15}}>{item.quantity}</Text>
                    <Button style={styles.qtnBtn} color='warning' 
                    onPress={() => this.incQuantity(item.id)}>+</Button>
                    <Button style={styles.cardBtn} color='error' 
                    onPress={() => this.deleteOrderBtn(item.id)}>Delete</Button>
                  </Card.Actions>
                </Card>
              )}
            />
          </Block>
        </Block>}
        {!isRefreshing && orders.length == 0 && <View style={{fontWeight: 'bold', alignSelf: "center"}}><Text style={{fontSize: 18}}>No items in your Cart</Text></View>}
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
  qtnBtn: {
    width: 35,
    height: 35,
  },
  cardBtn: {
    width: 130,
    height: 40,
    marginHorizontal: 80,
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



export default Cart;