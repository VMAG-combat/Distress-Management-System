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

const articles = [
  {
    title: 'Pepper Spray',
    image: 'https://i.imgur.com/2WpxDg1.jpg?2',
    price: 300,
    quantity: 1,
    key: '1',
  },
  {
    title: 'Stun Gun',
    image: 'https://i.imgur.com/GR5JdMt.png',
    price: 600,
    quantity: 2,
    key: '2',
  }
];




class Cart extends React.Component {
  totalPrice = () =>
  articles.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  )
  render() {
    return(
      <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
          Check your Shopping Cart
        </Text>
        <Text style={{paddingBottom: 15, paddingLeft: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: argonTheme.COLORS.HEADER}}>{"Subtotal: Rs " +this.totalPrice()}</Text>
        <Block flex>
          <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <FlatList
              data={articles}
              renderItem={({ item }) => (
                <Card style={styles.itemCard}>
                  <Card.Title title={item.title} />
                  <Card.Cover style={styles.cardImage} source={{uri: item.image}} />
                  <Card.Content>
                    <Paragraph style={styles.itemPrice}>{"Price: Rs " +item.price}</Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button style={{width: 35, height: 35}} color='warning'>-</Button>
                    <Text style={{fontSize: 15}}>1</Text>
                    <Button style={{width: 35, height: 35}} color='warning'>+</Button>
                    <Button style={styles.cardBtn} color='error'>Delete</Button>
                  </Card.Actions>
                </Card>
              )}
            />
          </Block>
        </Block>
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

export default Cart;