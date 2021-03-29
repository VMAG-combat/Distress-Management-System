import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input';
import axios from 'axios';

import ENV from '../env.';

import { Button } from "../components";
import { argonTheme } from "../constants";

import { UploadImage } from './UploadImage';

export const CreateEvent = ({ userid }) => {
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    organiser: '',
    dd: 1,
    mm: 1,
    yyyy: 2021,
    time: '',
    link: '',
    photo: '',
    imagebase64:'',
  });

  const createAlert = (message) =>
  Alert.alert(
    "",
    message,
    [
      
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
const saveImage = async (imageURL, imagebase64) => {
  //const response = await fetch(imageURL);
  //const blob = await response.blob();
  //console.log("Image saved : "+blob);
  setFormData({ ...formData, photo:imageURL, imagebase64:imagebase64});
}

const sendEvent = () => {
  console.log(formData);
  console.log("Sending Form data for event creation for user"+userid);
  axios({
    method: "POST",
    url: `${ENV.apiUrl}/event/createEvent`,
    data: { ...formData, userid: userid }
    
  }).then(res => {
      console.log(res.data);
      if(res.data.error==""){  
        setFormData({
          title: '',
          caption: '',
          organiser: '',
          dd: 1,
          mm: 1,
          yyyy: 2021,
          time: '',
          link: '',
          photo: '',
          imagebase64:'',
        })
        createAlert("Event Creation Successful!");
      }else{
        createAlert("Could not create event. Please Try Again!");
      }

  });


  //implement create event functionality
}
  return (
      <ScrollView>
    <View>
      <UploadImage saveImg={(imgurl, imagebase64) => saveImage(imgurl, imagebase64)} />
      <View >
        <TextInput
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          label="Event Name"
          value={formData.title}
        />

        <TextInput
          onChangeText={(text) =>
            setFormData({ ...formData, caption: text })
          }
          multiline
          label="Event Description"
          value={formData.caption}
        />
        <TextInput
          onChangeText={(text) => setFormData({ ...formData, organiser: text })}
          label="Organised By"
          value={formData.organiser}
        />
        <View style={{ backgroundColor: '#E7E7E7' }}>
            <Text
              style={{
                marginLeft: 15,
                marginTop: 20,
                fontSize: 16,
                color: '#555555',
              }}>
              Event Date (dd/mm/yyyy):{' '}
            </Text>
            <View
              style={{
                flex: 1,
                margin: 10,
                marginBottom: 20,
                flexDirection: 'row',
              }}>
              <NumericInput
                type="up-down"
                onChange={(value) => setFormData({ ...formData, dd: value })}
                minValue={1}
                maxValue={31}
                value={formData.dd}
              />
              <NumericInput
                type="up-down"
                onChange={(value) => setFormData({ ...formData, mm: value })}
                minValue={1}
                maxValue={12}
                value={formData.mm}
              />
              <NumericInput
                type="up-down"
                onChange={(value) => setFormData({ ...formData, yyyy: value })}
                minValue={2021}
                maxValue={3021}
                value={formData.yyyy}
              />
            </View>
          </View>
        <TextInput
          onChangeText={(text) => setFormData({ ...formData, time: text })}
          label="Time"
          value={formData.time}
        />
        <TextInput
          onChangeText={(text) => setFormData({ ...formData, link: text })}
          label="Event link"
          value={formData.link}
        />
      </View>
      <Button
        medium
        style={{ backgroundColor: argonTheme.COLORS.GRADIENT_START, marginBottom:50, alignSelf:'center' }}
        textStyle={{ fontSize: 18 }}
        onPress={sendEvent}
    >
        Create
    </Button>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flex: 1,
    flexDirection: 'row',
  },
  
});
