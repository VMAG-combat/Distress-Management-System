import React, {useState} from "react";
import { Image,View, StatusBar } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import deviceStorage from './services/deviceStorage.js'; 
import Screens from './navigation/Screens';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';




export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      jwt:'',
      id:'',
      loading:true
    }
    this.newJWT = this.newJWT.bind(this);
    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();

  }

  newJWT(jwt){
    this.setState({
      jwt: jwt
    });
  }

  componentDidMount(){

    registerFetchTask();
    // BackgroundFetch.registerTaskAsync('firstTask', {
    //   minimumInterval: 1
    // });
    // console.log(BackgroundFetch.getStatusAsync())
  }

  render() {
    
    return (
      
          <NavigationContainer>
            <Screens jwt={this.state.jwt} newJWT={this.newJWT} deleteJWT={this.deleteJWT} userId={this.state.id}/>
            <FlashMessage position="top" /> 
          </NavigationContainer>
      
          
    );
  }
}

TaskManager.defineTask('firstTask', () => {
  console.log("Firsttask")
});

const FETCH_TASKNAME = 'test_task'
const INTERVAL = 1

function test() {
    console.log('function is running')
}

async function registerFetchTask() {
    TaskManager.defineTask(FETCH_TASKNAME, test);

    const status = await BackgroundFetch.getStatusAsync();
    switch (status) {
        case BackgroundFetch.Status.Restricted:
        case BackgroundFetch.Status.Denied:
            console.log("Background execution is disabled");
            return;

        default: {
            console.debug("Background execution allowed");

            let tasks = await TaskManager.getRegisteredTasksAsync();
            if (tasks.find(f => f.taskName === FETCH_TASKNAME) == null) {
                console.log("Registering task");
                await BackgroundFetch.registerTaskAsync(FETCH_TASKNAME, {
                  minimumInterval:INTERVAL
                });

                tasks = await TaskManager.getRegisteredTasksAsync();
                console.debug("Registered tasks", tasks);
            } else {
                console.log(`Task ${FETCH_TASKNAME} already registered, skipping`);
            }

            console.log("Setting interval to", INTERVAL);
            // await BackgroundFetch.setMinimumIntervalAsync(INTERVAL);
        }
    }

}