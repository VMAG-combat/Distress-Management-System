import React from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
  View
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//galio
import { Block, Text, theme } from "galio-framework";
import { FAB } from 'react-native-paper';

//argon
import { articles, Images, argonTheme } from "../constants";
import { Card } from "../components";
import axios from 'axios';
import ENV from '../env.';
import ListItem from "../components/ListItem";

const { width } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

class Friends extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          friends:'',
          message:''
        }
    }

    componentDidMount(){
        axios({
            method: 'GET',
            url: `${ENV.apiUrl}/user/getfriend/`+this.props.route.params.route.params.userId,
          }).then((response) => {
          console.log("hi")
            this.setState({
              friends: response.data.friends,
              message: response.data.error
            });
          }).catch((error) => {
            this.setState({
              message: error.response.data.error,
              
            });
          });
      }
    render(){
        const {friends,message} = this.state;
        const { navigation } = this.props;
        // console.log("Friends: ",friends)
        return (
            <Block  center>
              <TouchableOpacity
              style={{backgroundColor: argonTheme.COLORS.GRADIENT_START,
              // borderRadius: 10,
              padding: 10,
              margin: 10,
              width:width,
            }}
              onPress={() => navigation.navigate("AddFriend", {'userId':this.props.route.params.route.params.userId})}
              >
              <Text bold center style={{color:'white', fontSize:20}}>Add Friends</Text>
            </TouchableOpacity>
              {
               (!friends) ?( <Text bold size={16} style={styles.title}>
                {message}
              </Text> )
              : (
            //     <ScrollView
            //      showsVerticalScrollIndicator={false}
            //    >
            // <Block flex style={styles.group}>
            //   <Text bold size={16} style={styles.title}>
            //     Cards
            //   </Text>
            //   <Block flex>
            //     <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            //       <Card item={articles[0]} horizontal />
            //       <Block flex row>
            //         <Card
            //           item={articles[1]}
            //           style={{ marginRight: theme.SIZES.BASE }}
            //         />
            //         <Card item={articles[2]} />
            //       </Block>
            //       <Card item={articles[4]} full />
            //       <Block flex card shadow style={styles.category}>
            //         <ImageBackground
            //           source={{ uri: Images.Products["View article"] }}
            //           style={[
            //             styles.imageBlock,
            //             { width: width - theme.SIZES.BASE * 2, height: 252 }
            //           ]}
            //           imageStyle={{
            //             width: width - theme.SIZES.BASE * 2,
            //             height: 252
            //           }}
            //         >
            //           <Block style={styles.categoryTitle}>
            //             <Text size={18} bold color={theme.COLORS.WHITE}>
            //               View article
            //             </Text>
            //           </Block>
            //         </ImageBackground>
            //       </Block>
            //     </Block>
            //     <Block flex style={{ marginTop: theme.SIZES.BASE / 2 }}>
            //       <ScrollView
            //         horizontal={true}
            //         pagingEnabled={true}
            //         decelerationRate={0}
            //         scrollEventThrottle={16}
            //         snapToAlignment="center"
            //         showsHorizontalScrollIndicator={false}
            //         snapToInterval={cardWidth + theme.SIZES.BASE * 0.375}
            //         contentContainerStyle={{
            //           paddingHorizontal: theme.SIZES.BASE / 2
            //         }}
            //       >
            //         {/* {categories &&
            //           categories.map((item, index) =>
            //             this.renderProduct(item, index)
            //           )} */}
            //       </ScrollView>
            //     </Block>
            //   </Block>
            // </Block>
            // </ScrollView>

            <View style={styles.container}>
            <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={(user) => (
                <ListItem user={user.item} />
            )}
        />
        </View>
              )
              }
               {/* <FAB
                  style={styles.fab}
                  medium
                  icon="plus"
                  onPress={() => navigation.navigate("CreatePost", {'userId':this.props.route.params.route.params.userId})}
                /> */}
               
            </Block>
          );
    }
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: 'flex-start',
  },
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
      // position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: argonTheme.COLORS.BUTTON_COLOR
    },
  });

  
export default Friends;