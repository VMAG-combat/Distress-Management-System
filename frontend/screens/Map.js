import { Block } from "galio-framework";
import React, { Component } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, Dimensions, ScrollView,Text,View } from "react-native";
import { isLoaded } from "expo-font";
const { width } = Dimensions.get("screen");
import Geolocation from "@react-native-community/geolocation";
import axios from "axios";
import ENV from "../env.";
import deviceStorage from "../services/deviceStorage";
import { showMessage } from "react-native-flash-message";

export default class Map extends Component {
  state = { isLoading: true, helpers: [] ,hotspot:false,center:[]};
  
  getHelpers = async () => {
    //code to get helpers from db

    var id = await deviceStorage.getId()
    var helpers = [
      { latitude: 26.499, longitude: 80.289, id:1 },
      { latitude: 26.5, longitude: 80.28 , id:2},
      { latitude: 26.488, longitude: 80.28 , id:3},
    ];
    deviceStorage.getHelpers().then( (help)=>{
      if(help){
      JSON.parse(help).forEach(helper => {

        helpers.push(
          {latitude:helper.latitude,longitude:helper.longitude,id:helper.id}
        )
      });
    }
      
    })
    this.setState({helpers, id: id });
  };
  
  updateLocation =() => {
    this.getHelpers().then(() => {
      Geolocation.getCurrentPosition(
        async (position) => {
          
          this.setState({
            current: { longitude: position.coords.longitude, latitude: position.coords.latitude},
            map: { latitudeDelta: 0.03, longitudeDelta: 0.03, longitude: position.coords.longitude, latitude: position.coords.latitude },
            isLoading: false,
          });
          deviceStorage.saveKey("longitude", position.coords.longitude.toString())
          deviceStorage.saveKey("latitude", position.coords.latitude.toString())
          
          axios
            .put(`${ENV.apiUrl}/user/updatelocation`, {
              userid: this.state.id,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            })
            .then((res) => {
              
              
              this.setState({
                hotspot:res.data.hotspot,
                center:{latitude: res.data.center[0],longitude:res.data.center[1]},
                isLoading:false
              })
              if(res.data.hotspot)
              showMessage({
                message: "Area around you has been identified as a HOTSPOT.\n STAY ALERT , STAY SAFE!!!",
                type: "warning",
                icon: { icon: "warning", position: "left" },
                duration: 7000,
              });
            });

          axios
            .get(`${ENV.apiUrl}/user/getNearestUsers/`+this.state.id+"/"+position.coords.longitude+"/"+position.coords.latitude
            //  {
            //   userid: this.state.id,
            //   longitude: position.coords.longitude,
            //   latitude: position.coords.latitude,
            // }
            )
            .then((res) => {
              
              if(res.data.users.length !==0){
              this.setState({ helpers: res.data.users });}

             
            });
          
        },
        (err) => {
          console.log("error :",err);
        },
        { enableHighAccuracy: false, timeout: 20000 }
      );
    });
  }
  componentDidMount() {
    
    this.props.navigation.addListener('focus', () => {
      this.updateLocation()
      // this.getHelpers();
      
    });
    this.updateLocation()
    // this.getHelpers().then(() => {
    //   Geolocation.getCurrentPosition(
    //     async (position) => {
          
    //       this.setState({
    //         current: { longitude: position.coords.longitude, latitude: position.coords.latitude},
    //         map: { latitudeDelta: 0.03, longitudeDelta: 0.03, longitude: position.coords.longitude, latitude: position.coords.latitude },
    //         isLoading: false,
    //       });
    //       deviceStorage.saveKey("longitude", position.coords.longitude.toString())
    //       deviceStorage.saveKey("latitude", position.coords.latitude.toString())
          
    //       axios
    //         .put(`${ENV.apiUrl}/user/updatelocation`, {
    //           userid: this.state.id,
    //           longitude: position.coords.longitude,
    //           latitude: position.coords.latitude,
    //         })
    //         .then((res) => {
              
              
    //           this.setState({
    //             hotspot:res.data.hotspot,
    //             center:{latitude: res.data.center[0],longitude:res.data.center[1]},
    //             isLoading:false
    //           })
    //           if(res.data.hotspot)
    //           showMessage({
    //             message: "Area around you has been identified as a HOTSPOT.\n STAY ALERT , STAY SAFE!!!",
    //             type: "warning",
    //             icon: { icon: "warning", position: "left" },
    //             duration: 7000,
    //           });
    //         });

    //       axios
    //         .get(`${ENV.apiUrl}/user/getNearestUsers/`+this.state.id+"/"+position.coords.longitude+"/"+position.coords.latitude
    //         //  {
    //         //   userid: this.state.id,
    //         //   longitude: position.coords.longitude,
    //         //   latitude: position.coords.latitude,
    //         // }
    //         )
    //         .then((res) => {
              
    //           if(res.data.users.length !==0){
    //           this.setState({ helpers: res.data.users });}

             
    //         });
          
    //     },
    //     (err) => {
    //       console.log("error :",err);
    //     },
    //     { enableHighAccuracy: false, timeout: 20000 }
    //   );
    // });
  }
  
  render() {
    return (
      <Block flex style={styles.home}>
    
        {!this.state.isLoading ? (
          <MapView
          loadingEnabled={true}
            initialRegion={{ ...this.state.map }}
            provider={PROVIDER_GOOGLE}
            style={styles.home}
            onRegionChange={(region) => {
              this.setState({ map: { ...region } });
            }}
          >
            {this.state.hotspot?(<MapView.Circle
            center = {{...this.state.center}}
            radius = { 500 }
            strokeColor = "red"
            fillColor="rgba(232, 37, 60,0.3)"
            strokeColor="rgba(232, 37, 60,0.3)"
            eWidth = { 1 }
        />):null}
            
            <Marker pinColor="blue" coordinate={{ ...this.state.current }} />
            {this.state.helpers.map((helper) => {
              return <Marker pinColor="green" coordinate={{ ...helper }} key={helper.id} />;
            })}
          </MapView>
         ) :null}
         
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
