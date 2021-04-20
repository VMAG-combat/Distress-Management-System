// import React from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Image,
//   TouchableWithoutFeedback,
//   ImageBackground,
//   Dimensions
// } from "react-native";
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// //galio
// import { Block, Text, theme } from "galio-framework";

// //argon
// import { articles, Images, argonTheme } from "../constants";
// import { Card } from "../components";
// import axios from 'axios';
// import ENV from '../env.';

// import Posts from './Posts';
// import Friends from './Friends';

// const { width } = Dimensions.get("screen");

// const thumbMeasure = (width - 48 - 32) / 3;
// const cardWidth = width - theme.SIZES.BASE * 2;
// const categories = [
//   {
//     title: "Music Album",
//     description:
//       "Rock music is a genre of popular music. It developed during and after the 1960s in the United Kingdom.",
//     image:
//       "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=840&q=80",
//     price: "$125"
//   },
//   {
//     title: "Events",
//     description:
//       "Rock music is a genre of popular music. It developed during and after the 1960s in the United Kingdom.",
//     image:
//       "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
//     price: "$35"
//   }
// ];

// const Tab = createMaterialTopTabNavigator();

// function PostTab({navigation, route}){
//   // console.log()
//    return (
//     <Posts navigation={navigation} route={route}/>
//   );
// }
// function FriendTab({navigation, route}){
//   // console.log(route)
//    return (
//     <Friends navigation={navigation} route={route}/>
//   );
// }
// class SocialMedia extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       userId:'',
//       // loading:true,
//       posts:'',
//       user:'',
//       friends:'',
//       message:''
//     }
//     // this.renderCards = this.renderCards.bind(this);
//   }
// //   componentDidMount(){
// //     axios({
// //       method: 'GET',
// //       url: `${ENV.apiUrl}/social/myposts/`+this.props.route.params.userId,
// //     }).then((response) => {
// // console.log("hi")
// //       this.setState({
// //         posts: response.data.posts,
// //         message: response.data.error
// //       });
// //     }).catch((error) => {
// //       this.setState({
// //         message: error.response.data.error,

// //       });
// //     });
// //   }

//   // renderProduct = (item, index) => {
//   //   const { navigation } = this.props;

//   //   return (
//   //     <TouchableWithoutFeedback
//   //       style={{ zIndex: 3 }}
//   //       key={`product-${item.title}`}
//   //       onPress={() => navigation.navigate("Pro", { product: item })}
//   //     >
//   //       <Block center style={styles.productItem}>
//   //         <Image
//   //           resizeMode="cover"
//   //           style={styles.productImage}
//   //           source={{ uri: item.image }}
//   //         />
//   //         <Block center style={{ paddingHorizontal: theme.SIZES.BASE }}>
//   //           <Text
//   //             center
//   //             size={16}
//   //             color={theme.COLORS.MUTED}
//   //             style={styles.productPrice}
//   //           >
//   //             {item.price}
//   //           </Text>
//   //           <Text center size={34}>
//   //             {item.title}
//   //           </Text>
//   //           <Text
//   //             center
//   //             size={16}
//   //             color={theme.COLORS.MUTED}
//   //             style={styles.productDescription}
//   //           >
//   //             {item.description}
//   //           </Text>
//   //         </Block>
//   //       </Block>
//   //     </TouchableWithoutFeedback>
//   //   );
//   // };

//   // renderCards(props){
//   //   const message = props.route.params.message

//   //   return (
//   //     <Block flex center>
//   //       {
//   //         !this.state.posts ?( <Text bold size={16} style={styles.title}>
//   //         No Posts Available
//   //       </Text> )
//   //       : (
//   //         <ScrollView
//   //          showsVerticalScrollIndicator={false}
//   //        >
//   //     <Block flex style={styles.group}>
//   //       <Text bold size={16} style={styles.title}>
//   //         Cards
//   //       </Text>
//   //       <Block flex>
//   //         <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
//   //           <Card item={articles[0]} horizontal />
//   //           <Block flex row>
//   //             <Card
//   //               item={articles[1]}
//   //               style={{ marginRight: theme.SIZES.BASE }}
//   //             />
//   //             <Card item={articles[2]} />
//   //           </Block>
//   //           <Card item={articles[4]} full />
//   //           <Block flex card shadow style={styles.category}>
//   //             <ImageBackground
//   //               source={{ uri: Images.Products["View article"] }}
//   //               style={[
//   //                 styles.imageBlock,
//   //                 { width: width - theme.SIZES.BASE * 2, height: 252 }
//   //               ]}
//   //               imageStyle={{
//   //                 width: width - theme.SIZES.BASE * 2,
//   //                 height: 252
//   //               }}
//   //             >
//   //               <Block style={styles.categoryTitle}>
//   //                 <Text size={18} bold color={theme.COLORS.WHITE}>
//   //                   View article
//   //                 </Text>
//   //               </Block>
//   //             </ImageBackground>
//   //           </Block>
//   //         </Block>
//   //         <Block flex style={{ marginTop: theme.SIZES.BASE / 2 }}>
//   //           <ScrollView
//   //             horizontal={true}
//   //             pagingEnabled={true}
//   //             decelerationRate={0}
//   //             scrollEventThrottle={16}
//   //             snapToAlignment="center"
//   //             showsHorizontalScrollIndicator={false}
//   //             snapToInterval={cardWidth + theme.SIZES.BASE * 0.375}
//   //             contentContainerStyle={{
//   //               paddingHorizontal: theme.SIZES.BASE / 2
//   //             }}
//   //           >
//   //             {categories &&
//   //               categories.map((item, index) =>
//   //                 this.renderProduct(item, index)
//   //               )}
//   //           </ScrollView>
//   //         </Block>
//   //       </Block>
//   //     </Block>
//   //     </ScrollView>
//   //       )
//   //       }

//   //     </Block>
//   //   );
//   // };

// //   renderAlbum = () => {
// //     const { navigation } = this.props;
// //     // console.log("kko")
// // //  console.log(this.state.message)
// //       // axios({
// //       //   method: 'GET',
// //       //   url: `${ENV.apiUrl}/user/getfriend`+this.props.route.params.userId,
// //       // }).then((response) => {
// //       // console.log("hi")
// //       //   this.setState({
// //       //     friends: response.data.friends,
// //       //     message: response.data.error
// //       //   });
// //       // }).catch((error) => {
// //       //   this.setState({
// //       //     message: error.response.data.error,

// //       //   });
// //       //   console.log(this.state.message)
// //       // });
// //     return (
// //       <Block flex center>
// //          <ScrollView
// //            showsVerticalScrollIndicator={false}
// //         >
// //       <Block
// //         flex
// //         style={[styles.group, { paddingBottom: theme.SIZES.BASE * 5 }]}
// //       >
// //         <Text bold size={16} style={styles.title}>
// //           Album
// //         </Text>
// //         <Block style={{ marginHorizontal: theme.SIZES.BASE * 2 }}>
// //           <Block flex right>
// //             <Text
// //               size={12}
// //               color={theme.COLORS.PRIMARY}
// //               onPress={() => navigation.navigate("Home")}
// //             >
// //               View All
// //             </Text>
// //           </Block>
// //           <Block
// //             row
// //             space="between"
// //             style={{ marginTop: theme.SIZES.BASE, flexWrap: "wrap" }}
// //           >
// //             {Images.Viewed.map((img, index) => (
// //               <Block key={`viewed-${img}`} style={styles.shadow}>
// //                 <Image
// //                   resizeMode="cover"
// //                   source={{ uri: img }}
// //                   style={styles.albumThumb}
// //                 />
// //               </Block>
// //             ))}
// //           </Block>
// //         </Block>
// //       </Block>
// //       </ScrollView>
// //       </Block>
// //     );
// //   };

//   render() {

//     const {message,posts,friends} = this.state;
//     console.log(this.props.route.params.userId)

//     return (
//        <Tab.Navigator>
//       <Tab.Screen name="Posts" component={PostTab} initialParams={{'userId':this.props.route}}/>
//       <Tab.Screen name="Friends" component={FriendTab} />
//       {/* <Tab.Screen name="My Feeds" component={this.renderProduct} /> */}
//     </Tab.Navigator>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   title: {
//     paddingBottom: theme.SIZES.BASE,
//     paddingHorizontal: theme.SIZES.BASE * 2,
//     marginTop: 22,
//     color: argonTheme.COLORS.HEADER
//   },
//   group: {
//     paddingTop: theme.SIZES.BASE
//   },
//   albumThumb: {
//     borderRadius: 4,
//     marginVertical: 4,
//     alignSelf: "center",
//     width: thumbMeasure,
//     height: thumbMeasure
//   },
//   category: {
//     backgroundColor: theme.COLORS.WHITE,
//     marginVertical: theme.SIZES.BASE / 2,
//     borderWidth: 0
//   },
//   categoryTitle: {
//     height: "100%",
//     paddingHorizontal: theme.SIZES.BASE,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   imageBlock: {
//     overflow: "hidden",
//     borderRadius: 4
//   },
//   productItem: {
//     width: cardWidth - theme.SIZES.BASE * 2,
//     marginHorizontal: theme.SIZES.BASE,
//     shadowColor: "black",
//     shadowOffset: { width: 0, height: 7 },
//     shadowRadius: 10,
//     shadowOpacity: 0.2
//   },
//   productImage: {
//     width: cardWidth - theme.SIZES.BASE,
//     height: cardWidth - theme.SIZES.BASE,
//     borderRadius: 3
//   },
//   productPrice: {
//     paddingTop: theme.SIZES.BASE,
//     paddingBottom: theme.SIZES.BASE / 2
//   },
//   productDescription: {
//     paddingTop: theme.SIZES.BASE
//     // paddingBottom: theme.SIZES.BASE * 2,
//   }
// });

// export default SocialMedia;

import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import Posts from "./Posts";
import Friends from "./Friends";
import MyFeed from "./MyFeed";
import CreatePost from "./CreatePost";
import AddFriend from "./AddFriend.js";
import deviceStorage from "../services/deviceStorage";

import { Icon, Header } from "../components";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function FeedStack({ navigation, route }) {
  // console.log(navigation);
  return <MyFeed navigation={navigation} route={route} />;
}
function CreatePostStack({ navigation, route }) {
  return <CreatePost navigation={navigation} route={route} />;
}
function MyFeedTab({ navigation, route }) {
  // console.log()
  return (
    <Stack.Navigator
      initialRouteName="MyFeed"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyFeed" component={FeedStack} initialParams={{ navigation: navigation, route: route }} />
      <Stack.Screen name="CreatePost" component={CreatePostStack} initialParams={{ navigation: navigation, route: route }} />
    </Stack.Navigator>
    // <Posts navigation={navigation} route={route}/>
  );
}
function AddFriendStack({navigation,route}){
  return <AddFriend navigation={navigation} route={route} />;
}
function FriendStack({ navigation, route }) {
  // console.log(route)
  return <Friends navigation={navigation} route={route} />;
}
function FriendTab({ navigation, route }) {
  // console.log()
  return (
    <Stack.Navigator
      initialRouteName="Friends"
      screenOptions={{
        headerShown: false,
      }}      
    >
      <Stack.Screen name="Friends" component={FriendStack} initialParams={{ navigation: navigation, route: route }} />
      <Stack.Screen name="AddFriend" component={AddFriendStack} initialParams={{ navigation: navigation, route: route }} />
    </Stack.Navigator>
    // <Posts navigation={navigation} route={route}/>
  );
}
function PostTab({ navigation, route }) {
  // console.log(route)
  return <Posts navigation={navigation} route={route} />;
}
class SocialMedia extends React.Component {
  state = {};
  render() {
    deviceStorage.getId().then((userId) => {
      this.setState({ id: userId });
    });

    return (
      <>
        {this.state.id ? (
          <Tab.Navigator>
            <Tab.Screen name="Posts" component={PostTab} initialParams={{ userId: this.state.id }} />
            <Tab.Screen name="Friends" component={FriendTab} initialParams={{ userId: this.state.id }} />
            <Tab.Screen name="My Feeds" component={MyFeedTab} initialParams={{ userId: this.state.id }} />
            {/* <Tab.Screen name="My Feeds" component={this.renderProduct} /> */}
          </Tab.Navigator>
        ) : null}
      </>
    );
  }
}

export default SocialMedia;
