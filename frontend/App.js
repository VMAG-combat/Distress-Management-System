import React, { useState } from "react";
import { Image, View, StatusBar } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import deviceStorage from "./services/deviceStorage.js";
import Screens from "./navigation/Screens";
import ENV from "./env.";
import axios from "axios";
export default class App extends React.Component {
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
    this.loadJWT();
    this.updateLocation();
  }
  updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
      { enableHighAccuracy: true }
    );
  };
  newJWT(jwt) {
    this.setState({
      jwt: jwt,
    });
  }

  render() {
    return (
      <NavigationContainer>
        <Screens jwt={this.state.jwt} newJWT={this.newJWT} deleteJWT={this.deleteJWT} userId={this.state.id} />
        <FlashMessage position="top" />
      </NavigationContainer>
    );
  }
}
