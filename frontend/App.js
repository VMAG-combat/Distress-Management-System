import React, { useState } from "react";
import { Image, View, StatusBar } from "react-native";
import { AppLoading } from "expo";
// import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import deviceStorage from "./services/deviceStorage.js";
import Screens from "./navigation/Screens";
import ENV from "./env.";
import axios from "axios";
import Geolocation from "@react-native-community/geolocation";
import BackgroundTask from "react-native-background-task";
// import KeyEvent from "react-native-keyevent";
BackgroundTask.define(() => {
  console.log("scheduling background task");
  var app = new App();
  app.updateLocation();
  BackgroundTask.finish();
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      jwt: "",
      id: "",
      loading: true,
    };
    this.newJWT = this.newJWT.bind(this);
    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT().then(() => {
      this.updateLocation();
    });
  }
  componentDidMount() {
    // KeyEvent.onKeyDownListener((keyEvent) => {
    //   console.log(`onKeyDown keyCode: ${keyEvent.keyCode}`);
    //   console.log(`Action: ${keyEvent.action}`);
    //   console.log(`Key: ${keyEvent.pressedKey}`);
    // });
    BackgroundTask.schedule();
  }
  updateLocation = () => {
    // console.log(this.state);
    // this.inter = setInterval(() => {
    if (this.state.id && this.state.id !== "")
      Geolocation.getCurrentPosition(
        (position) => {
          deviceStorage.saveKey("longitude", position.coords.longitude.toString())
          deviceStorage.saveKey("latitude", position.coords.latitude.toString())
          axios
            .put(`${ENV.apiUrl}/user/updatelocation`, {
              userid: this.state.id,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            })
            .then((res) => {
              console.log(res.data);
            });
        },
        (err) => {
          console.log("e", err);
        },
        { enableHighAccuracy: false, timeout: 20000 }
      );
    // }, 5000);
  };
  newJWT(jwt) {
    this.setState({
      jwt: jwt,
    });
  }
  // componentWillUnmount() {
  //   // clearTimeout(this.inter);
  // }
  render() {
    return (
      <NavigationContainer>
        <Screens jwt={this.state.jwt} newJWT={this.newJWT} deleteJWT={this.deleteJWT} userId={this.state.id} />
        <FlashMessage position="top" />
      </NavigationContainer>
    );
  }
}
export default App;
