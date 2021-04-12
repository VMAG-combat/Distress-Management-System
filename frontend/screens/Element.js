import React from 'react';
import { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import deviceStorage from "../services/deviceStorage";
//import { theme } from 'galio-framework';

import { AllEvents } from './AllEvents';
import { MyEvents } from './MyEvents';
import { CreateEvent } from './CreateEvent';

export const Elements = (props) => {
  const [chosentab, setChosentab] = useState('tab0');
  const[userid, setUserid] = useState();
  const colors = ['#A80EC3', '#D3ACDA'];
  deviceStorage.getId().then((userId)=>{
    setUserid(userId)
  })
  
  useEffect(() => {
    console.log("User id iss: "+userid); 
  },[userid]);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabbar}>
        <View style={styles.button}>
          <Button
            title="All Events"
            color={chosentab == 'tab0' ? colors[0] : colors[1]}
            onPress={() => setChosentab('tab0')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="My Events"
            color={chosentab == 'tab1' ? colors[0] : colors[1]}
            onPress={() => setChosentab('tab1')}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.addbar}
        onPress={() => setChosentab('tab2')}>
        <Ionicons name="add-circle-outline" size={45} />
        <Text style={{ fontSize: 20, paddingLeft: 5 }}>Create New Event</Text>
      </TouchableOpacity>

      {chosentab == 'tab0' ? (
        <AllEvents userid={userid}></AllEvents>
      ) : chosentab == 'tab1' ? (
        <MyEvents changeTab={() => setChosentab('tab0')} userid={userid} />
      ) : (
        <CreateEvent userid={userid}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    //paddingTop: theme.SIZES.BASE,
    //paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignSelf: 'stretch',
  },
  addbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
  },
});

export default Elements;