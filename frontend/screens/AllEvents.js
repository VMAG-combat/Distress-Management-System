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
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Avatar, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';

import ENV from '../env.';


export const AllEvents = ({userid}) => {

  const registerAlert = (message) =>
  Alert.alert(
    "",
    message,
    [
      { text: "OK", onPress: () => {console.log("OK Pressed");
    } },
      
    ]
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [options, setOptions] = useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);

  const [data, setdata] = useState([]);
  const [alldata, setAllData] = useState([]);
  const showOptions = () => {
    setOptions(true);
  };
  const searchFunction = (field) => {
    console.log('Search Function called with field: ' + field+" and search Query: "+searchQuery);

    //perform search operations
    axios({
      method: "GET",
      url: `${ENV.apiUrl}/event/searchEvents/${field}/${searchQuery}/${userid}`,      
    }).then(res => {
        console.log(res.data);
        if(res.data.count=='0'){
          console.log("No data found");
          setdata([]);
        }
        else if(res.data.error==""){  
          console.log("Search Events fetched successfully"); 
          setdata(res.data.events);
        }else{
          console.log("Error in fetching user events");
        }
    });
  };

  useEffect(() => {
    console.log("User id is: "+userid); 
    console.log("Calling all user events");
    axios({
      method: "GET",
      url: `${ENV.apiUrl}/event/getAllEvents/${userid}`,      
    }).then(res => {
        // console.log(res.data);
        if(res.data.error==""){  
          console.log("All Events fetched successfully"); 
          console.log(res.data.events)
          setdata(res.data.events);
          setAllData(res.data.events);
        }else{
          console.log("Error in fetching user events");
        }
    });
  },[]);

  const registerEvent = (eventid) => {
    console.log('Register event id: ' + eventid);
    //implement register event logic

    axios({
      method: "POST",
      url: `${ENV.apiUrl}/event/registerEvent/${userid}/${eventid}`,      
    }).then(res => {
        // console.log(res.data);
        if(res.data.message==""){  
          console.log("Event Registered successfully"); 
          registerAlert("Event Registration Successful! Organiser will contact you for further details. \nOrganiser Email: "+res.data.oemail);
        }else if(res.data.message=='registered already'){
          console.log("Already Registered");
          registerAlert("Already Registered!");
        }else{
          console.log("Error in registering event");
        }
    });

  };
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          onIconPress={showOptions}
        />
      </View>
      {options && searchQuery ? (
        <>
          <Text style={{ textAlign: 'center', marginTop: 5 }}>Search By: </Text>
          <View style={styles.searchby}>
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => searchFunction('title')}>
              <Text>Event Name</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => searchFunction('caption')}>
              <Text>Description</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => searchFunction('date')}>
              <Text>Date</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => searchFunction('organiser')}>
              <Text>Organiser</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <></>
      )}

      { data.length == 0
      ? (
        <View style={{justifyContent:'center', alignItems:'center',flex:1}}>
        <Text style={{fontSize:18, color:'#A10D0D', fontWeight:'bold'}}>No Events Found!</Text>
        <TouchableOpacity
              style={{backgroundColor: '#9D0DA1',
              borderRadius: 10,
              padding: 20,
              margin: 10,}}
              onPress={() => {setdata(alldata)}}>
              <Text style={{color:'white', fontSize:15}}>Show All Events</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <></>
      )
      }

      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Card>
              <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.organiser}</Paragraph>
              </Card.Content>
              <Card.Cover source={{ uri: item.photo }} style={{height:350}} />
              <Card.Content>
                <Paragraph>{item.caption}</Paragraph>
                <Paragraph>
                  {item.date._seconds?item.date._seconds:item.date} {item.time}
                </Paragraph>
                <Paragraph>{item.link}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => registerEvent(item.id)}>Register</Button>
              </Card.Actions>
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

  searchby: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  buttons: {
    backgroundColor: '#D7C70A',
    borderRadius: 10,
    padding: 10,
    margin: 1,
  },
});
