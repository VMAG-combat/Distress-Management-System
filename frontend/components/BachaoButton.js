import React from 'react';
import {View,StyleSheet,TouchableHighlight,Text,Image,Animated, Button,Dimensions, Linking, PermissionsAndroid,Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import * as SMS from 'expo-sms';
// import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

import SmsAndroid from 'react-native-get-sms-android';
import deviceStorage from '../services/deviceStorage';
import axios from 'axios';
import ENV from '../env.';

const { width, height } = Dimensions.get('window');
class BachaoButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          count:0,
          message:'',
          nearByHelpers:[]
        }
        
        // console.log(this.state);
      }
    //   async componentDidMount() {
    //     try {
    //       let granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.SEND_SMS, {
    //           title: 'Send SMS',
    //           message: 'Need access to send sms',
    //         },
    //       );
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         console.log('SEND_SMS permissions granted', granted);
    //       } else {
    //         Alert.alert('SEND_SMS permissions denied');
    //         console.log('SEND_SMS permissions denied');
    //       }
    //     } catch (err) {
    //       Alert.alert(err);
    //     }
    //   };
    buttonSize = new Animated.Value(1);
    mode = new Animated.Value(0);

    registerIncident = async () => {
        const coord = await deviceStorage.loadCoords();
        
        
        
        deviceStorage.getId().then((userId) => {
        
        var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    const currDateTime = new Date(year,month-1,date,hours,min,sec).toLocaleString();
    // console.log(dadte)
    // var currDateTime = date + '/' + month + '/' + year 
    //   + ' ' + hours + ':' + min + ':' + sec
        axios.post(`${ENV.apiUrl}/incident/registerIncident`,{
            userid: userId,
            longitude:coord[1],
            latitude:coord[0],
            datetime:currDateTime,
            status:'active'
        }).then((response) => {
            
            // console.log(response.data.helpers);
            var temp=[]
            for(const h of response.data.helpers)
            temp.push(h.phone)

                  var messsage = "I'm is Distress. Please Help me. \nMy Location Coordinates are given below: \nLatitude: " +coord[0]+"\nLongitude: "+coord[1];
               temp.forEach(async (helper)=>{
                   if(helper){
                   console.log('sendin msg to ',helper);
                  //   await SmsAndroid.autoSend(
                  //      helper,
                  //      messsage,
                  //      (fail) => {
                  //        console.log('Failed with this error: ' + fail);
                  //      },
                  //      (success) => {
                  //        console.log('SMS sent successfully');
                  //      },
                  //    );
                   }
               });
            deviceStorage.saveKey("helpers", JSON.stringify(response.data.helpers));
            
            console.log("Incident Registered!!!")
          })
          .catch((error) => {
            console.log(error);
          });


          
          
       
        }
        )
        
        const ecc = []
          deviceStorage.getEmergencyContacts().then( (contacts)=>{
              JSON.parse(contacts).forEach(contact => {
                  
                  ecc.push(
                    contact.phoneno
                  )
                });
                var messsage = "I'm is Distress. Please Help me. \nMy Location Coordinates are given below: \nLatitude: " +coord[0]+"\nLongitude: "+coord[1];
                ecc.forEach(async (helper)=>{
                    if(helper){
                    console.log('sendin msg to ',helper);
                   //   await SmsAndroid.autoSend(
                   //      helper,
                   //      messsage,
                   //      (fail) => {
                   //        console.log('Failed with this error: ' + fail);
                   //      },
                   //      (success) => {
                   //        console.log('SMS sent successfully');
                   //      },
                   //    );
                    }
                });
            })
        
    }
    handdlePress = async () =>{
        // e.preventDefault();

        
        Animated.sequence([
            Animated.timing(this.buttonSize,{
                toValue:0.6,
                duration:100,
                useNativeDriver:true
            }),
            Animated.timing(this.buttonSize,{
                toValue:1,
                duration:0,
                useNativeDriver:true,
            }),
            // Animated.timing(this.mode, {
            //     toValue: this.mode._value === 0 ? 1 : 0,
            //     duration:300
            // })
        ]).start();
        
        this.setState({
            count: this.state.count+1,
        })
        if(this.state.count>=2){
            this.registerIncident();
        
        console.log("Bachao");
    
        this.setState({
            count: 0,
        })

        }
    };
    render(){
        const {navigation} = this.props;

        const sizeStyle = {
            transform: [{scale: this.buttonSize}]
        }

        const galleryX = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,-0.0460*height]
        })
        const galleryY = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,-0.04977*height]
        })


        const vibranceX = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,0.016177*height]
        })
        const vibranceY = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,-0.08717*height]
        })


        const contactX = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,0.0784*height]
        })
        const contactY = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,-0.04981*height]
        })

        return (
            <View style={{position:'absolute',bottom:0.00622*height, alignItems:'center',backgroundColor:'transparent'}}>
                {/* <Animated.View style={{position:"absolute",left: galleryX, top: galleryY}}>
                    <View style={styles.secondary_button}>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('Merch')}}>
                        <Ionicons name="ios-pricetags" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View style={{position:"absolute",left: vibranceX, top: vibranceY}}>
                    <View style={styles.secondary_button}>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('stats')}}>
                        <Ionicons name="ios-stats" size={24} color="white"/>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View style={{position:"absolute",left: contactX, top: contactY}}>
                    <View style={styles.secondary_button}>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('gallery')}}>
                        <Ionicons name="ios-images" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View> */}
                <Animated.View style={[styles.button,sizeStyle]}>
                    <TouchableHighlight onPress={this.handdlePress} underlayColor={0}>
                        <Animated.View style={{backgroundColor:"#aa2fd6",height:0.1094*height,width:0.1094*height,borderRadius:0.08717*height,justifyContent:'center',alignItems:'center',shadowColor:'black',shadowOffset: {width:0.1244*height,height:0.1244*height},shadowOpacity: 1}}>
                            <Image
                            style={{position:'relative',height:0.1094*height,width:0.1094*height,borderRadius:0.08717*height,borderWidth:1,borderColor: 'white',shadowColor:'black',shadowOffset: {width:0.1244*height,height:0.1244*height},shadowOpacity: 1}}
                            source={require('../assets/icon.png')}
                            />
                        </Animated.View>
                    </TouchableHighlight>     
                </Animated.View>
            </View>
        );
    }
}


const withNavigation = (Component) => {
    return (props) => {
      const navigation = useNavigation();
  
      return <Component navigation={navigation} {...props} />;
    };
  };
export default withNavigation(BachaoButton);


const styles = StyleSheet.create({
    button:{
        
        borderRadius:0.08710*height,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems:'center',
        shadowColor:'black',
        shadowRadius:0,
        shadowOffset:{height:0.0248*height},
        shadowOpacity:1,
        elevation:6
    },
    secondary_button:{
        position:'absolute',
        alignItems:'center',
        justifyContent:'center',
        width:0.1020*width,
        height:0.1020*width,
        borderRadius:0.061*width,
        backgroundColor:'#aa2fd6',
    }
});