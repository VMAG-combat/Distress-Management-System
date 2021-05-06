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


class Order extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      orders: "",
      message: "",
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
      url: `${ENV.apiUrl}/store/getMyOrders/` +this.state.userId,
    }).then((response) => {
      this.setState({
        orders: response.data.orders,
        message: response.data.error,
        isRefreshing: false,
      });
    }).catch((error) => {
      this.setState({
        message: 'Error retrieving data' +error.message,
        isRefreshing: false,
      });
    });

  }


  orderReceived = async (val)=> {
    const orderId = val;
    await axios({
      method: "POST",
      url: `${ENV.apiUrl}/store/orderReceived/` +orderId,
    }).then(res => {
        if (res.data.error != '') {
          Alert.alert(res.data.error)
        }
        this.componentDidMount();
    });
  }

  render() {
    const orders = this.state.orders;
    const isRefreshing = this.state.isRefreshing;
    return(
      <Block flex style={styles.group}>
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
                    <View style={{marginTop: 15, flexDirection: 'row', justifyContent: 'space-between',
                      alignItems: 'center'}}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>{"Price: " +item.price}</Text>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>{"Quantity: " +item.quantity}</Text>
                    </View>
                    <View>
                      <Text style={{fontWeight: 'bold', fontSize: 17, color: '#616161'}}>{"Order made on: " +item.madeOn}</Text>
                      {item.received == 'no' ? <Text style={{fontWeight: 'bold', fontSize: 17, color: '#ffcc29'}}>{"Arriving on: " +item.arrival}</Text> : <Text style={{fontWeight: 'bold', fontSize: 17, color: '#289672', marginBottom: 15}}>Order Received</Text>}
                    </View>
                  </Card.Content>
                  { item.received == 'no' &&
                    <Card.Actions>
                      <Button style={{width: 100, height: 35}} color='warning' onPress={()=> this.orderReceived(item.id)}>Received</Button>
                    </Card.Actions>
                  }
                </Card>
              )}
            />
          </Block>
        </Block>}
        {!isRefreshing && orders.length == 0 && <View style={{fontWeight: 'bold', alignSelf: "center"}}><Text style={{fontSize: 18}}>You don't have any previous Orders</Text></View>}
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



export default Order;