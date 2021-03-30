import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Card } from '../components';
import articles from '../constants/articles';
const { width } = Dimensions.get('screen');
import deviceStorage from '../services/deviceStorage.js'; 
import axios from 'axios';
import ENV from '../env.'


class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id:'',
      loading:true,
      user: '',
      message:''
    }
    
    
    this.loadID = deviceStorage.loadID.bind(this);
    this.loadID();
    // console.log(this.state);
  }

  componentDidMount(){
    
    const userId = this.state.id;
    
    axios({
      method: 'GET',
      url: `${ENV.apiUrl}/user/getprofile/`+userId,
    }).then((response) => {
      this.setState({
        user: response.data.user,
        message: response.data.message

      });
    }).catch((error) => {
      this.setState({
        message: 'Error retrieving data',
        loading: false
      });
    });
    
  }


  renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          <Card item={articles[0]} horizontal  />
          <Block flex row>
            <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <Card item={articles[2]} />
          </Block>
          <Card item={articles[3]} horizontal />
          <Card item={articles[4]} full />
        </Block>
      </ScrollView>
    )
  }

 
  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
     
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
