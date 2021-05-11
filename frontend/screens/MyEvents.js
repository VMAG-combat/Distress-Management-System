import React, { useState, useEffect } from 'react';
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
  BackHandler,
  ActivityIndicator,
} from 'react-native';

import { Searchbar } from 'react-native-paper';
import { Avatar, Card, Title, Paragraph, Button } from 'react-native-paper';

import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import ENV from '../env.';

export const MyEvents = ({ userid }) => {

  const deleteAlert = (message, eventid) =>
  Alert.alert(
    "",
    message,
    [
      { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
      { text: "OK", onPress: () => {console.log("OK Pressed");
      deleteEvent(eventid);
    } },
      
    ]
  );

  const deletedAlert = (message) =>
  Alert.alert(
    "",
    message,
    [
      { text: "OK", onPress: () => {console.log("OK Pressed");
    } },
      
    ]
  );

  const [data, setdata] = useState([]);
  const [show, setShow] = useState(false);
  const [isRefreshing,setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('Show');

  const deleteEvent = (eventid) => {
    // console.log('Delete event id: ' + eventid);
    //implement delete event logic /deleteEvent/:eventId
    axios({
      method: "POST",
      url: `${ENV.apiUrl}/event/deleteEvent/${eventid}`,      
    }).then(res => {
        // console.log(res.data);
        if(res.data.error){  
          console.log("Could not delete");
        }else{
          console.log("Event Deleted Successfully!");
          deletedAlert("Event Deleted Successfully!");
          axios({
            method: "GET",
            url: `${ENV.apiUrl}/event/myevents/${userid}`,      
          }).then(res => {
              // console.log(res.data);
              if(res.data.error==""){  
                console.log("User events fetched successfully");
                setdata(res.data.events);
              }else{
                console.log("Error in fetching user events");
              }
          });
        }
    });
  };

  useEffect(() => {
    // console.log("User id is: "+userid); 
    setIsRefreshing(true);
    console.log("Calling all user events");
    axios({
      method: "GET",
      url: `${ENV.apiUrl}/event/myevents/${userid}`,      
    }).then(res => {
        // console.log(res.data);
        if(res.data.error==""){  
          console.log("User events fetched successfully");
          setdata(res.data.events);
          
        }else{
          console.log("Error in fetching user events");
        }
        setIsRefreshing(false);
    });
  },[]);

  if(isRefreshing){
    return (
      <View style={{flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
        zIndex:100}} >
                <ActivityIndicator size='large' color="#0000ff"  />
                <Text>Loading...</Text>
            </View>
    );
      }
      if(!isRefreshing && data.length === 0){
        return (
          <View style={{justifyContent:'center', alignItems:'center',flex:1}}>
          <Text style={{fontSize:18, color:'#A10D0D', fontWeight:'bold'}}>No Events Found!</Text>
          </View>
        )}
  const showParticipants = () => {
    console.log('Toggle Function called');
    const newshow = !show;
    setShow(newshow);
    const newmessage = message == 'Show' ? 'Hide' : 'Show';
    setMessage(newmessage);
    console.log(newshow);
    console.log(newmessage);
  };
  return (
    <View style={{ flex: 1 }}>
      {/* <TouchableOpacity
        onPress={() => showParticipants()}
        style={{
          alignItems: 'center',
          backgroundColor: '#DDDDDD',
          padding: 10,
        }}>
        <Text>{message} Participants</Text>
      </TouchableOpacity> */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Card key={item.id}>
              <Card.Content style={{backgroundColor:'#F0E3F3'}}>
                <Title>{item.title}</Title>
                <Paragraph>{item.organiser}</Paragraph>
              </Card.Content>
              <Card.Cover source={{ uri: 'data:image/jpeg;base64,'+item.imagebase64 }} style={{height:350}} />
              <Card.Content>
                <Paragraph>{item.caption}</Paragraph>
                <Paragraph>
                  {item.date._seconds?item.date._seconds:item.date} : {item.time}
                </Paragraph>
                <Paragraph>{item.link}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <TouchableOpacity>
                  <Button
                    labelStyle={{ color: '#CA093B' }}
                    onPress={() => deleteAlert("Are you sure you want to delete this event?",item.id)}>
                    Delete
                  </Button>
                </TouchableOpacity>
              </Card.Actions>
              <Card.Content style={{backgroundColor:'#E9C6F3', paddingTop:5}}>
              <Paragraph style={{fontWeight:'bold', alignSelf:'center'}}>Registered Participants</Paragraph>
                  {item.registered.map((i) => (
                  <TouchableOpacity styles={{}} key={i.userid}>
                     <Text style = {styles.text}>
                        {i.name} : {i.email}
                     </Text>
                  </TouchableOpacity>
                 ))
                  }
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flex: 1,
    flexDirection: 'row',
  },
});
