import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  View,
  // Button
} from "react-native";
import { Block, Checkbox, Input, Text, theme } from "galio-framework";
import { Images, argonTheme } from "../constants";
import { showMessage } from "react-native-flash-message";
import axios from "axios";
import ENV from "../env.";
import deviceStorage from "../services/deviceStorage.js";
import OTPTextInput from "react-native-otp-textinput";

import RNRestart from "react-native-restart";
class Otp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVerified: false,
      otp: "",
      verifying:false,
    };
  }

  getOtp(otp) {
    console.log(otp);
    this.setState({ otp });
  }
  render() {
    const { navigation } = this.props;
    const handleCodeVerify = async () => {
      console.log(this.props);
      var otp1 = this.state.otp;
      var otp2 = this.props.route.params.otp;
      if (otp1 === otp2) {
        this.setState({
          verifying:true
        })
        if (this.props.route.params.isSignUp) {
          console.log("okkk");
          axios
            .post(`${ENV.apiUrl}/auth/register`, {
              name: this.props.route.params.name,
              email: this.props.route.params.email,
              password: this.props.route.params.password,
              phone: this.props.route.params.phone,
              address: this.props.route.params.address,
            })
            .then((response) => {
              this.setState({
                otp: "",
                isVerified: true,
              });
              console.log("ok");
            })
            .catch((error) => {
              console.log(error);
              // this.onLoginFail();
            });
          navigation.navigate("Login");
          showMessage({
            message: "OTP verification successful",
            type: "success",
            icon: { icon: "success", position: "left" },
            duration: 3000,
          });

          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: 'Login' }],
          // })
        } else if (this.props.route.params.isSignIn) {
          console.log("ok1");
          await axios
            .post(`${ENV.apiUrl}/auth/login`, {
              email: this.props.route.params.email,
              password: this.props.route.params.password,
            })
            .then((response) => {
              deviceStorage.saveKey("id_token", response.data.token);
              deviceStorage.saveKey(response.data.token, response.data.id);
              // this.props.newJWT(response.data.tokens);
              this.setState({
                otp: "",
                isVerified: true,
              });
              console.log("ok");
            })
            .catch((error) => {
              console.log(error);
              // this.onLoginFail();
            });

          showMessage({
            message: "OTP verification successful",
            type: "success",
            icon: { icon: "success", position: "left" },
            duration: 3000,
          });
          // navigation.navigate("App");
          // delay(3000);
          RNRestart.Restart();
        }
      } else {
        return showMessage({
          message: "OTP verification failed",
          type: "danger",
          icon: { icon: "danger", position: "left" },
          duration: 3000,
        });
      }
    };

    // renderHome
    return (
      <Block flex middle>
        <Text bold style={styles.text} size={24}>
          Enter OTP password
        </Text>
        <OTPTextInput
          inputCount={6}
          handleTextChange={(otp) => {
            this.setState({ otp: otp });
          }}
        />

        <Block middle>
          <TouchableOpacity style={styles.verify} onPress={handleCodeVerify}>
            {
              this.state.verifying ? (
                <Text bold size={20} color={argonTheme.COLORS.PRIMARY}>
              Verifying...
            </Text>
              ) :
              <Text bold size={20} color={argonTheme.COLORS.PRIMARY}>
              Verify
            </Text>
            }
            
          </TouchableOpacity>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginBottom: 14,
  },
  otpinput: {
    justifyContent: "center",
    // paddingHorizontal: '25%',
    width: "50%",
  },
  verify: {
    marginTop: 50,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});
export default Otp;
