import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image,Modal, ActivityIndicator, TouchableOpacity } from 'react-native';

import {Text,theme} from 'galio-framework'
import ENV from '../env.';
import { Button } from "../components";
// import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {  argonTheme } from "../constants";
// import * as usersActions from '../../store/actions/users';
import { showMessage } from "react-native-flash-message";
// import VerifiedUser from '../../constants/VerifiedUser';
// import { Octicons } from '@expo/vector-icons';
import axios from 'axios';
import AddHelpers from '../components/AddHelpers';
import deviceStorage from '../services/deviceStorage';



const ListIncident = (props) => {
    const { incident,allusers } = props;

    // console.log(allusers)
    // console.log("incident",incident.helpers);
    // console.log("user:",user.name)
    const [add, setAdd] = useState('');


    // check user._id is in following list

    const [imageUri, setImageUri] = useState();
    const [users, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [helpers,setHelpers] = useState([]);

    const onImageErrorHandler = () => {
        setImageUri(ENV.defaultImageUri)
    }

    
    useEffect(async ()=>{
      if(incident.latitude){
      
        try{
      await axios.get(`https://us1.locationiq.com/v1/reverse.php?key=c3878484ac573f&lat=` + (incident.latitude) + '&lon=' + (incident.longitude) + '&format=json').then((res)=>{
  
          console.log("Address: " ,res.data.display_name)
          setAdd(res.data.display_name)
      }).catch((err)=>{
        console.log("ff",err)
      })
    } catch(err){
      console.log(err)
    }
    }
    })
    


    const toggleModal= ()=>{
        setModalVisible(true)
    }

    const closeModal= ()=>{
      setModalVisible(false)
      // console.log(helpers)
      axios
            .post(`${ENV.apiUrl}/incident/updateIncident`, {
              incidentId: incident.id,
              helpers:helpers
            })
            .then((res) => {
              console.log("kl")
              console.log(res.data);
              deviceStorage.deleteHelpers()
            });
  }
    const addHelpers = (helper) =>{
    setHelpers([...helpers,helper])
    }
    
    const deactivateIncident =() => {
      axios
            .post(`${ENV.apiUrl}/incident/deactivateIncident`, {
              id: incident.id,
            })
            .then((res) => {
              console.log("kl")
              console.log(res.data);
              deviceStorage.deleteHelpers()
            });
    }
    return (<>
         {/* <View style={styles.container}> */}
         
            {/* <View style={styles.content}> */}
                <View style={styles.mainContent}>
                <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
          {/* {addHelpers()} */}
     <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Helpers</Text>
            <AddHelpers allusers={allusers} helpers={addHelpers}/>
            <Button style={{backgroundColor:argonTheme.COLORS.BUTTON_COLOR,marginBottom:20}} onPress={()=> closeModal()} >
              <Text size={24} color="white">
                Done
              </Text>
              </Button>
           
          </View> 
      </View>
      </Modal>
                    <View style={styles.text}>
                        <Text
                            // onPress={() => navigation.navigate('Home', { screen: 'UserProfile', params: { userId: user._id, name: user.name }})}
                            style={{color:'#000000', padding:4}}
                            bold
                            size={15}
                        >
                            Date and Time: 
                            
                        </Text>
                        <Text style={{color:argonTheme.COLORS.PRIMARY, padding:5}}>
                        { incident.datetime + " " }
                        </Text>
                    </View>
                    <View style={styles.text}>
                        <Text
                            // onPress={() => navigation.navigate('Home', { screen: 'UserProfile', params: { userId: user._id, name: user.name }})}
                            style={{color:'#000000', padding:4}}
                            bold
                            size={16}
                        >
                            Location
                          
                        </Text>
                        
                    </View>
                    <View style={styles.text}>
                    <Text style={{color:argonTheme.COLORS.PRIMARY}}>
                        { add + " " }
                        </Text>
                    </View>
                    <View style={styles.text}>
                        <Text
                            // onPress={() => navigation.navigate('Home', { screen: 'UserProfile', params: { userId: user._id, name: user.name }})}
                            style={{color:'#000000', padding:4}}
                            bold
                            size={15}
                        >
                            Status : 
                            
                            
                        </Text>
                        <Text style={{color: incident.status==='active'? argonTheme.COLORS.ERROR : incident.status==='false'? argonTheme.COLORS.WARNING:argonTheme.COLORS.SUCCESS , padding:5}} bold>
                        { incident.status + " " }
                        </Text>
                        { incident.status === "active" ?(
                            <Button small style={{ backgroundColor: argonTheme.COLORS.LABEL }} textStyle={{ fontSize: 10 }} onPress={()=>deactivateIncident()}>
                            Deactivate
                          </Button>
                        ) : null

                        }
                    </View>
                    { incident.helpers !=="" ? (<>
                         <View style={styles.text}>
                         <Text
                             // onPress={() => navigation.navigate('Home', { screen: 'UserProfile', params: { userId: user._id, name: user.name }})}
                             style={{color:'#000000', padding:4}}
                             bold
                             size={16}
                         >
                             Helpers
                             
                             
                         </Text>
                         
                     </View>
                     <View style={styles.text}>
                     <Text style={{color:argonTheme.COLORS.PRIMARY}}>
                         { incident.helpers + " " }
                         </Text>
                     </View>
                     </>
                    ):( incident.status === 'false' ?null :( 
                        <TouchableOpacity onPress={toggleModal}>
            <Text bold size={16} color={argonTheme.COLORS.PRIMARY} >
              ADD HELPERS
            </Text>
          </TouchableOpacity>
                    ))}
                    
                </View>
               
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 16,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: "#FFFFFF",
        alignItems: 'flex-start',
      },
      avatar: {
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor: '#c2c2c2'
      },
      text: {
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap:'wrap'
      },
      content: {
        flex: 1,
        // borderBottomWidth:1,
        
      },
      mainContent: {
        borderRadius:5,
        // borderBottomLeftRadius
    //     borderWidth: 1,
    //     borderBottomWidth:1,
    // borderColor: "#000000",
        padding:20,
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
    
      },
      img: {
        height: 50,
        width: 50,
        margin: 0
      },
      attachment: {
          
      },
      separator: {
        height: 1,
        backgroundColor: "#CCCCCC"
      },
      timeAgo:{
        fontSize:12,
        color:"#696969"
      },
      name:{
        fontSize:16,
        color:"#1E90FF"
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})

export default ListIncident;