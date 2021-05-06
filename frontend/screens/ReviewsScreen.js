import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  Alert,
  Modal,
} from "react-native";
import { Block, Text, theme} from "galio-framework";

import { Button, Input} from "../components";
import { argonTheme } from "../constants";
import { MaterialIcons } from '@expo/vector-icons';
import {Card, Paragraph} from 'react-native-paper';
import axios from 'axios';
import ENV from '../env.';
import deviceStorage from '../services/deviceStorage.js'; 

export const ratingImages = {
  ratings: {
    '1': require('../assets/ratings/rating1.png'),
    '2': require('../assets/ratings/rating2.png'),
    '3': require('../assets/ratings/rating3.png'),
    '4': require('../assets/ratings/rating4.png'),
    '5': require('../assets/ratings/rating5.png'),
  }
};
    

class ReviewsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      userId: '',
      itemId: this.props.itemId,
      reviews: '',
      userName: '',
      message: '',
      reviewContent: '',
      reviewRatting: '',
      isRefreshing: false,
    }
  }

  async componentDidMount() {
    this.setState({
      isRefreshing: true,
    });
    deviceStorage.getId().then((userId) => {
      this.setState({
        userId: userId
      })
    })
    await axios({
      method: 'GET',
      url: `${ENV.apiUrl}/store/getAllReviews/` +this.state.itemId,
    }).then((response) => {
      this.setState({
        reviews: response.data.reviews,
        message: response.data.error,
        isRefreshing: false,
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
        userName: response.data.user.name,
        message: response.data.message

      });
      
    }).catch((error) => {
      this.setState({
        message: 'Error retrieving data',
        
      });
    });
  }

  toggleModal = () => {
    if (this.state.modalOpen === true) {
      this.setState({
        modalOpen: false,
      })
    } else {
      this.setState({
        modalOpen: true,
      })
    }
  }

  changeContentHandler = (val) => {
    this.setState({
      reviewContent: val,
    })
  }

  changeRattingHandler = (val) => {
    this.setState({
      reviewRatting: val,
    })
  }

  addReviewBtn = async () => {
    const reviewContent = this.state.reviewContent;
    const reviewRatting = this.state.reviewRatting;
    if (reviewContent.length <= 3) {
      Alert.alert('OOPS, content length must be greater than 3');
    } else if (Number(reviewRatting) < 1 || Number(reviewRatting) > 5) {
      Alert.alert('OOPS, ratting must be 1-5');
    } else {
      await axios({
        method: "POST",
        url: `${ENV.apiUrl}/store/createReview/` +this.state.itemId +`/` +this.state.userId,
        data: { content: reviewContent, ratting: reviewRatting }
      }).then(res => {
          if (res.data.error != '') {
            Alert.alert("Some Error occurred. Please try again")
          }
          this.setState({
            reviewContent: "",
            reviewRatting: "",
          })
          this.componentDidMount();
          this.toggleModal();
      });
    }
  }

  deleteReviewBtn = async (val) => {
    const reviewId = val;
    await axios({
      method: "POST",
      url: `${ENV.apiUrl}/store/deleteReview/` +reviewId,
    }).then(res => {
        if (res.data.message != '') {
          Alert.alert("Some Error occurred. Please try again")
        }
        this.componentDidMount();
    });
  }

  render() {
    const modalOpen = this.state.modalOpen;
    const reviews = this.state.reviews;
    const userName = this.state.userName;
    const userId = this.state.userId;
    const isRefreshing = this.state.isRefreshing;
    return (
      <Block style={{ flex: 1, paddingHorizontal: theme.SIZES.BASE, paddingTop: 20 }}>
        {!isRefreshing && <Modal visible={modalOpen}>
          <View>
            <MaterialIcons 
              name='close'
              size={24}
              style={{marginTop: 20, backgroundColor: '#1687a7',
              color: 'white', padding: 7, borderRadius: 20, alignSelf: 'center'}}
              onPress={this.toggleModal}
            />
            <Card style={{ marginBottom: 20}}>
              <Card.Content>
                <Text style={{left: 6, marginBottom: 10, fontSize: 18, color: 'grey'}}>{userName}</Text>
                <Input 
                  right
                  placeholder='Content...'
                  onChangeText={this.changeContentHandler} 
                  value={this.state.reviewContent} 
                />
                <Input
                  right
                  keyboardType='numeric'
                  placeholder='Ratting...'
                  onChangeText={this.changeRattingHandler} 
                  value={this.state.reviewRatting} 
                />
                <Button style={{ alignSelf: 'center'}} onPress={this.addReviewBtn} color='primary'>Add Review</Button>
              </Card.Content>
            </Card>
          </View>
        </Modal>}
        <MaterialIcons 
          name='arrow-back'
          size={24}
          style={{}}
          onPress={() => this.props.navigation.navigate('Products')}
        />
        {!isRefreshing && <MaterialIcons 
          name='add'
          size={24}
          style={{marginTop: 0, marginBottom: 15, backgroundColor: '#1687a7',
          color: 'white', padding: 7, borderRadius: 20, alignSelf: 'center'}}
          onPress={this.toggleModal}
        />}
        {!isRefreshing ? 
          (reviews.length != 0 ? <FlatList
            keyExtractor={(item) => item.id}
            data={reviews}
            renderItem={({ item }) => (
              <Card style={styles.itemCard}>
                <Card.Title title={item.userName} />
                <Card.Content>
                  <Paragraph style={{fontSize: 15, color: argonTheme.COLORS.HEADER, marginBottom: 10}}>{item.content}</Paragraph>
                  {item.userId == userId && 
                    <MaterialIcons 
                      name='delete'
                      size={26}
                      style={{marginTop: -15, marginBottom: 10, alignSelf: 'flex-end'}}
                      onPress={() => this.deleteReviewBtn(item.id)}
                    />
                  }
                  <View style={styles.rating}>
                    <Image source={ratingImages.ratings[item.ratting]} />
                  </View>
                </Card.Content>
              </Card>
            )}
          />
          :
          <Button style={{alignSelf: 'center'}}color='primary' onPress={()=>this.toggleModal()}>No reviews Yet. Add one</Button>
          )
        : <View style={{fontWeight: 'bold', alignSelf: "center"}}><Text style={{fontSize: 18}}>Page is Refreshing ....</Text></View>
        }
      </Block>
    )
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
    marginTop: 0,
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


export default ReviewsScreen;