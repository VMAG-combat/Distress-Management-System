import React from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";

import { NodeCameraView } from "react-native-nodemediaclient";

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

class IncidentStreamer extends React.Component {
  vb = null;

  state = {
    isStreaming: true,
    cameraSettings: { cameraId: 1, cameraFrontMirror: true },
  };

  videoSettings = {
    preset: 12,
    bitrate: 400000,
    profile: 1,
    fps: 15,
    videoFrontMirror: false,
  };

  audioSettings = { bitrate: 32000, profile: 1, samplerate: 44100 };

  get height() {
    return Dimensions.get("window").height;
  }

  get width() {
    return Dimensions.get("window").width;
  }

  toggleStream = async () => {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

    if (this.state.isStreaming) {
      this.vb.stop();
    } else {
      this.vb.start();
    }
    this.setState({
      isStreaming: !this.state.isStreaming,
    });
  };
  componentDidMount() {
    try {
      setTimeout(() => {
        this.vb.start();
      }, 100);
    } catch (err) {
      console.log(err);
    }
  }
  componentWillUnmount() {
    try {
      this.vb.stop();
    } catch (err) {}
  }
  render() {
    console.log(this.props.route.params);
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.view}>
          <NodeCameraView
            style={{
              height: this.height,
              width: this.width,
              zIndex: 1,
              backgroundColor: "#000000",
            }}
            ref={(vb) => {
              this.vb = vb;
            }}
            outputUrl={`rtmp://192.168.1.107/live/${this.props.route.params.incidentId}`}
            camera={this.state.cameraSettings}
            audio={this.audioSettings}
            video={this.videoSettings}
            autopreview={true}
          ></NodeCameraView>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={this.toggleStream}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>
                  {this.state.isStreaming
                    ? "Stop Streaming"
                    : "Start Streaming"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.state.cameraSettings.cameraId =
                  this.state.cameraSettings.cameraId === 2 ? 1 : 2;
                this.setState({});
              }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Switch Camera</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

export default IncidentStreamer;
