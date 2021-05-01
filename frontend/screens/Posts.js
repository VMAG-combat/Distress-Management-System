import React from "react";
import {
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  FlatList
} from "react-native";
//galio
import { Block, Text, theme } from "galio-framework";

//argon
import { articles, Images, argonTheme } from "../constants";
import { Card } from "../components";
import PostCard from '../components/PostCard';
import axios from 'axios';
import ENV from '../env.';

const { width } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

class Posts extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          userId:'',
          posts:'',
          message:'',
          isRefreshing: false
        }
    }

    componentDidMount(){
      
        // axios({
        //   method: 'GET',
        //   url: `${ENV.apiUrl}/social/getposts/`+this.props.route.params.userId,
        // }).then((response) => {

        //   this.setState({
        //     posts: response.data.posts,
        //     message: response.data.error
        //   });
        // }).catch((error) => {
        //   this.setState({
        //     message: error.response.data.error,
            
        //   });
        // });
        this.loadPosts();

        
      }
      loadPosts = () =>{
        this.setState({
          isRefreshing: true
        })
        axios({
          method: 'GET',
          url: `${ENV.apiUrl}/social/getposts/`+this.props.route.params.userId,
        }).then((response) => {

          console.log(response.data.posts)
          this.setState({
            posts: response.data.posts,
            message: response.data.error,
            isRefreshing: false,
          });
        }).catch((error) => {
          this.setState({
            message: error.response.data.error,
            isRefreshing: false,
            
          });
        });
          // axios({
          //     method: 'GET',
          //     url: `${ENV.apiUrl}/social/myposts/`+this.props.route.params.route.params.userId,
          //   }).then((response) => {
          //     // console.log(response.data.posts)
          //     this.setState({
          //       posts: response.data.posts,
          //       message: response.data.error,
          //       isRefreshing: false,
          //     });
          //   }).catch((error) => {
          //     this.setState({
          //       message: error.response.data.error,
          //       isRefreshing: false,
          //     });
          //   });
        }
    render(){
        
        const {posts,message} = this.state;
        const {navigation} = this.props;
        // console.log(posts)
        return (
            <Block flex center>
              {
               ((!posts) || (posts.length ==0)) ?( <Text bold size={16} style={styles.title}>
                No Posts Available
              </Text> )
              : (
                <View style={styles.screen} >
                <FlatList
                    style={styles.list}
                    onRefresh={this.loadPosts}
                    refreshing={this.state.isRefreshing}
                    data={posts}
                    keyExtractor={(item) => item.id }
                    ItemSeparatorComponent={() => {
                        return (
                          // <></>
                            <View style={styles.separator} />
                        )
                    }}
                    
                    renderItem={({item, index}) => {
                        return (
                            <PostCard 
                                post={item}
                               
                                index={index}
                               
                            />
                        );
                    }} 
                />
    
          </View>
              )
              }

               
            </Block>
          );
    }
};


const styles = StyleSheet.create({
    title: {
      paddingBottom: theme.SIZES.BASE,
      paddingHorizontal: theme.SIZES.BASE * 2,
      marginTop: 22,
      color: argonTheme.COLORS.HEADER
    },
    group: {
      paddingTop: theme.SIZES.BASE
    },
    albumThumb: {
      borderRadius: 4,
      marginVertical: 4,
      alignSelf: "center",
      width: thumbMeasure,
      height: thumbMeasure
    },
    category: {
      backgroundColor: theme.COLORS.WHITE,
      marginVertical: theme.SIZES.BASE / 2,
      borderWidth: 0
    },
    categoryTitle: {
      height: "100%",
      paddingHorizontal: theme.SIZES.BASE,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center"
    },
    imageBlock: {
      overflow: "hidden",
      borderRadius: 4
    },
    productItem: {
      width: cardWidth - theme.SIZES.BASE * 2,
      marginHorizontal: theme.SIZES.BASE,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 7 },
      shadowRadius: 10,
      shadowOpacity: 0.2
    },
    productImage: {
      width: cardWidth - theme.SIZES.BASE,
      height: cardWidth - theme.SIZES.BASE,
      borderRadius: 3
    },
    productPrice: {
      paddingTop: theme.SIZES.BASE,
      paddingBottom: theme.SIZES.BASE / 2
    },
    productDescription: {
      paddingTop: theme.SIZES.BASE
      // paddingBottom: theme.SIZES.BASE * 2,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: argonTheme.COLORS.BUTTON_COLOR
    },
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
  },
  centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  list: {
      width:  width,
    
  },
  separator: {
      // marginTop: 10,
  },
  });

  
export default Posts;