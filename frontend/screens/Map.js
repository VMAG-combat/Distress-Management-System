import { Block } from "galio-framework";
import React, { Component } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { isLoaded } from "expo-font";
const { width } = Dimensions.get("screen");
export default class Map extends Component {
  state = { isLoading: true, helpers: [] };
  getHelpers = async () => {
    //code to get helpers from db
    var helpers = [
      { latitude: 30.21, longitude: 74.3 },
      { latitude: 30.22, longitude: 74.31 },
    ];
    this.setState({ helpers });
  };
  componentDidMount() {
    this.getHelpers();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude);
        this.setState({
          current: { longitude: position.coords.longitude, latitude: position.coords.latitude, isLoading: false },
          map: { latitudeDelta: 0.1, longitudeDelta: 0.1, longitude: position.coords.longitude, latitude: position.coords.latitude },
          isLoading: false,
        });
        console.log(this.state);
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true }
    );
  }
  render() {
    return (
      <Block flex style={styles.home}>
        {!this.state.isLoading ? (
          <MapView
            initialRegion={{ ...this.state.map }}
            provider={PROVIDER_GOOGLE}
            style={styles.home}
            onRegionChange={(region) => {
              this.setState({ map: { ...region } });
            }}
          >
            <Marker pinColor="blue" coordinate={{ ...this.state.current }} />
            {this.state.helpers.map((helper) => {
              return <Marker pinColor="green" coordinate={{ ...helper }} />;
            })}
          </MapView>
        ) : null}
      </Block>
    );
  }
}
const styles = StyleSheet.create({
  home: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
