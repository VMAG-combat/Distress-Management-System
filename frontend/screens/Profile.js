import React from "react";
import { StyleSheet, Dimensions, ScrollView,Alert, Image,View,PermissionsAndroid,FlatList,TouchableOpacity, ImageBackground, Platform, TouchableHighlight } from "react-native";
import { Block, Text, theme } from "galio-framework";
import RNRestart from "react-native-restart";

import { Button,Icon } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";

import deviceStorage from "../services/deviceStorage.js";
import axios from "axios";
import ENV from "../env.";
import Contacts from 'react-native-contacts';

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      message: "",
      isRefreshing:false,
      contacts:null
    };

    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
  }

  componentDidMount() {
    // if(Platform.OS === 'ios'){
    //   Contacts.getAll((err, contacts) => {
    //     if (err) {
    //       throw err;
    //     }
    //     // contacts returned
    //     this.setState({contacts})
    //   })
    // }else if(Platform.OS === 'android'){
    //   PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    //     {
    //       title: 'Contacts',
    //       message: 'This app would like to view your contacts.'
    //     }
    //   ).then(() => {
    //     Contacts.getAll((err, contacts) => {
    //       if (err === 'denied'){
    //         // error
    //       } else {
    //         // contacts returned in Array
    //         this.setState({contacts})
    //       }
    //     })
    //   })
    // }
    // Contacts.getAll((err, contacts) => {
    //   if (err === 'denied'){
        
    //     // error
    //   } else {
    //     // contacts returned in Array
    //     this.setState({contacts})
    //   }
    // })
    Contacts.getAll()
    .then((contacts) => {
      // console.log(contacts)
      this.setState({contacts})
    })
    .catch((e) => { 
      console.log(e);
    })
    this.props.navigation.addListener('focus', () => {
      this.loadProfile()
      
      // this.getHelpers();
      
    });
    this.loadProfile()
    
  }
  loadProfile = () => {
    
    this.setState({
      isRefreshing: true
    })
   deviceStorage.getId().then((userId) => {
    
      axios.get(`${ENV.apiUrl}/user/getprofile/` + userId)
    .then((user) => {
        this.setState({
          isRefreshing:false,
          user: user.data.user,
          message: user.data.message,
          isRefreshing:false
        });

        deviceStorage.saveKey("emergency_contacts", JSON.stringify(this.state.user.emergencyContacts));
        
      })
      .catch((error) => {
        this.setState({
          message: "Error retrieving data",
          isRefreshing:false
        });
      });
  });
  
  }
  getHelp = () =>{

    Alert.alert(
      "How to Earn Points?",
      "You can earn points by helping the person in Distress. Once the person is recified he can add you as a helper through his account and you get the points for helping the victim.\nFor Each help you get 100 points.\n\nHELP AS MUCH AS YOU CAN!!!",
      [
        { text: "OK", onPress: () => {console.log("OK Pressed");
      } },
        
      ]
    );
  }

  render() {
    const { navigation } = this.props;
    const { user, message } = this.state;
    const handleLogout = () => {
      this.deleteJWT();
      RNRestart.Restart();
    };
    
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground source={Images.ProfileBackground} style={styles.profileContainer} imageStyle={styles.profileBackground}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width, marginTop: "25%", marginBottom:"15%" }} nestedScrollEnabled={true}>
            
            
            <Text bold size={14} color="black" style={{ position: "absolute",top:theme.SIZES.BASE+20,right:theme.SIZES.BASE }} onPress={()=>{navigation.navigate("Pro")}} >
                       Edit <Icon
                      style={styles.helpIcon}
      family="ionicon"
      size={18}
      name="create-outline"
      // color="white"
    />
                      </Text>
                      
              <Block flex style={styles.profileCard}>
              
                <Block middle style={styles.avatarContainer}>
                  <Image source={{ uri: Images.ProfilePicture }} style={styles.avatar} />
                </Block>
                <Block style={styles.info}>
                  <Block row space="between">
                    <Block middle>
                    {user.posts ? (
                      <Text bold size={18} color="#525F7F" style={{ marginBottom: 4 }}>
                       {user.posts.length}
                      </Text>):<Text bold size={18} color="#525F7F" style={{ marginBottom: 4 }}>
                       0
                      </Text>}
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        Posts
                      </Text>
                    </Block>
                    <Block middle>
                      {user.friends ? (
                      <Text bold color="#525F7F" size={18} style={{ marginBottom: 4 }}>
                      {user.friends.length}
                      </Text>) :<Text bold size={18} color="#525F7F" style={{ marginBottom: 4 }}>
                       0
                      </Text>
                      }
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        Friends
                      </Text>
                    </Block>
                    <Block middle>
                      {user.events ? (
                      <Text bold color="#525F7F" size={18} style={{ marginBottom: 4 }}>
                      {user.events.length}
                      </Text>) :<Text bold size={18} color="#525F7F" style={{ marginBottom: 4 }}>
                       0
                      </Text>
                      }
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        Events
                      </Text>
                    </Block>
                    <Block middle>
                      {user.incidents ? (
                      <Text bold color="#525F7F" size={18} style={{ marginBottom: 4 }}>
                      {user.incidents.length}
                      </Text>) :<Text bold size={18} color="#525F7F" style={{ marginBottom: 4 }}>
                       0
                      </Text>
                      }
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        Incidents
                      </Text>
                    </Block>
                  </Block>
                </Block>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {user.name}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {user.email}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {user.phone}
                    </Text>
                  </Block>
                  
                  <Block row space="between" style={{marginTop:20}}>
                    <Block middle>
                      <Text bold size={18} color="#525F7F" style={{ marginBottom: 4 }}>
                        {user.bloodGrp || `NA`}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        Blood Group
                      </Text>
                    </Block>
                    <Block middle>
                      <Text bold color="#525F7F" size={18} style={{ marginBottom: 4 }}>
                        {user.height||`NA`}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        Height
                      </Text>
                    </Block>

                    <Block middle>
                      <Text bold color="#525F7F" size={18} style={{ marginBottom: 4 }}>
                        {user.weight||`NA`}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        Weight
                      </Text>
                    </Block>
                    
                  </Block>
                  <Block middle style={{ marginTop: 20 }}>
                  <Block middle>
                    <Text size={16} color="#525F7F" style={{ textAlign: "center" }}>
                      Identification Mark : {user.identificationMark||`NA`}
                    </Text>
                    </Block>
                    </Block>
                    <Block middle style={{ marginTop: 20 }}>
                    <Block middle>
                      <View style={styles.points}> 
                      <TouchableOpacity style={styles.help} onPress={this.getHelp}>
                      <Icon
                      style={styles.helpIcon}
                        family="ionicon"
                        size={24}
                        name="help-circle"
                        color="white"
                      />
                      </TouchableOpacity>
                      <Text size={30} color="white" bold style={{ textAlign: "center" }}>
                      {user.points ? user.points:0}
                    </Text>
                      
                      <Text size={12} color="white" bold style={{ textAlign: "center" }}>
                      
                      Total Points Earned
                    </Text>
                    </View>
                    
                    </Block>
                    </Block>
                    <Block middle flex style={{padding:10,marginTop:10, borderColor: "#FFFFFF"}}>
                      {
                        user.emergencyContacts ? (
                        //   <Block middle flex style={{ position:'absolute',bottom:0, backgroundColor:"red"}}>
                        //   <ScrollView>
                        //     {
                        //   user.emergencyContacts.map(ec => {
                        //     // console.log(ec);
                        //     return (
                              
                        //     <Text size={24} style={{position:'absolute',bottom:0,textAlign:"center", zIndex:99, backgroundColor:'green'}}>{ec.name}</Text>
                        //     )
                        //   })
                          
                        // } 
                        //   </ScrollView>
                        //   </Block>
                          <Block middle flex style={{width:'100%', marginTop:35}}>
                            {/* <Text>hello</Text> */}
                          
                          {
                          user.emergencyContacts.map(ec => {
                            
                            // console.log(ec);
                            return (
                              <View style={styles.contact}>
                            <Text size={18} color="black"  style={{ textAlign: "center" }}>{ec.name + " \t "+ ec.phoneno}</Text>
                            
                            </View>
                          // ec.map(c =>{
                          //     return (
                              
                          //       <Text size={24} style={{position:'absolute',bottom:0,textAlign:"center", zIndex:99, backgroundColor:'green'}}>{c.name}</Text>
                          //       )
                          //   })
                            
                            )
                            })
                          
                          
                        } 
                        </Block>
        //                   <FlatList
        //                   scrollEnabled={false}
        //   data={user.emergencyContacts}
        //   renderItem={({ item }) => (
        //     <View>
        //       <Text style={styles.contact_details}>
        //         Name: {`${item.name} `} 
        //       </Text>
        //       {/* {item.phoneNumbers.map(phone => (
        //         <Text style={styles.phones}>{phone.label} : {phone.number}</Text>
        //       ))} */}
        //       <Text >Phone No. : {item.phoneno}</Text>  
        //     </View>
        //   )}
        //   //Setting the number of column
        //   numColumns={1}
        //   keyExtractor={(item, index) => index}
        // />
                        ):null
                      }
                      <Block middle style={{paddingTop:20}} >
                      <TouchableOpacity onPress={()=>{navigation.navigate("Pro",{contacts:this.state.contacts,userId:user.id})}}><Text bold color={argonTheme.COLORS.PRIMARY}>+ ADD EMERGENCY CONTACTS</Text></TouchableOpacity>
                      </Block>
                    </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
           
        
                    <Button medium style={{ backgroundColor: argonTheme.COLORS.GRADIENT_START }} textStyle={{ fontSize: 18 }} onPress={handleLogout}>
                      Logout
                    </Button>
                   
                  </Block>
                </Block>
              </Block>
             
            </ScrollView>
          </ImageBackground>
          
        </Block>
      </Block>
      
    );
  
  }
}

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    marginTop:"25%",
    marginBottom:"10%",
    paddingBottom:20,
    alignItems: 'flex-start',
  },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  separator: {
    // marginTop: -10,
  
    width:1,
    marginHorizontal:theme.SIZES.BASE,
    borderColor: "#000000",
},
points:{
  backgroundColor:argonTheme.COLORS.LABEL,
  padding: 25,
  borderRadius:10
},
help:{
  position:'absolute',
  top:1,
  right:2,
  shadowColor: "black",
  elevation:5,
  shadowOffset: {
    width: 3,
    height: 2
  },
  shadowOpacity: 1,
  shadowRadius: 5,

},
contact:{
  borderRadius:5,
  // borderBottomLeftRadius
//     borderWidth: 1,
//     borderBottomWidth:1,
// borderColor: "#000000",
  padding:20,
  marginBottom:10,
  width:'100%',
  backgroundColor:"#f7f7f7",
  padding: theme.SIZES.BASE,
marginHorizontal: theme.SIZES.BASE,
shadowColor: "#000",
shadowOffset: {
width: 3,
height: 2
},
shadowOpacity: 0.25,
shadowRadius: 5,
elevation: 3
}
});

export default Profile;
