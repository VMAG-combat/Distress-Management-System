import { NodePlayerView } from "react-native-nodemediaclient";
import React from "react";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
} from "react-native";
import ENV from "../env.";
let styles = StyleSheet.create({
  view: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    position: "relative",
  },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: 50,
    position: "absolute",
    zIndex: 2,
    bottom: 50,
  },
  button: {
    width: 200,
    height: 40,
    backgroundColor: "#014484",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "system",
  },
});

class IncidentViewer extends React.Component {
  render() {
    console.log(this.props.route.params.incidentId);
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <NodePlayerView
          style={{ height: 200 }}
          ref={(vp) => {
            this.vp = vp;
          }}
          inputUrl={
            "rtmp://"+ENV.ipAdd+"/live/" + this.props.route.params.incidentId
          }
          scaleMode={"ScaleAspectFit"}
          bufferTime={300}
          maxBufferTime={1000}
          autoplay={true}
        />
        <TouchableOpacity
          onPress={async () => {
            var res = await axios.get(
              `${ENV.apiUrl}/incident/${this.props.route.params.incidentId}`
            );
            var destination = res.data;
            var url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${destination.latitude},${destination.longitude}`;

            Linking.canOpenURL(url).then((supported) => {
              if (!supported) {
                console.log("Can't handle url: " + url);
              } else {
                return Linking.openURL(url);
              }
            });
          }}
        >
          <Text>Navigate</Text>
        </TouchableOpacity>
      </>
    );
  }
}

export default IncidentViewer;
