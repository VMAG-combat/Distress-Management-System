import React, { useState } from "react";
// import { Alert } from '@react-navigation/native';

import { TouchableOpacity, StyleSheet, View, Dimensions, ImageBackground, Alert } from "react-native";
import { Text, theme, Block } from "galio-framework";
import { showMessage } from "react-native-flash-message";

import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import ENV from "../env.";
import axios from "axios";

const { width, height } = Dimensions.get("screen");

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      isSignIn: false,
      otp: "",
      isSending:false,
    };
    this.loginUser = this.loginUser.bind(this);
    this.onLoginFail = this.onLoginFail.bind(this);
  }

  loginUser() {
    console.log("in login");
    const { email, password } = this.state;

    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    this.setState({ error: "" });

    if (emailError || passwordError) {
      this.setState({ ...this.state.email, ...this.state.password, emailError, passwordError });

      return (
        // Alert.alert(
        //     "Error!!!",
        //     emailError +"\n"+passwordError,
        //     [
        //       {
        //           text: 'Ok',
        //           onPress: () => console.log('Cancel Pressed'),
        //           style: 'cancel'
        //         },
        //     ]
        // )
        showMessage({
          message: "Please Enter Valid Email and Password!",
          type: "danger",
          icon: { icon: "danger", position: "left" },
          duration: 3000,
        })
      );
    } else {
      axios
        .post(`${ENV.apiUrl}/auth/sendotpForLogin`, {
          email: email,
          password: password,
        })
        .then((response) => {
          console.log("Login response body \n: "+response.data);
          console.log("Login otp: "+response.data.otp);
          this.setState({
            isSignIn: true,
            otp: response.data.otp,
            email: "",
            password: "",
            error: "",
            isSending:true
          });
          this.props.navigation.navigate("Otp", { otp: this.state.otp, isSignIn: this.state.isSignIn, email: email, password: password });
          showMessage({
            message: "Authenticated!! Please Enter the OTP sent to your mobile number",
            type: "success",
            icon: { icon: "success", position: "left" },
            duration: 3000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.onLoginFail();
        });
    }
  }

  onLoginFail() {
    this.setState({
      error: "Login Failed",
      isSignIn: false,
    });
    showMessage({
      message: "Login Failed! Email and Password do not match.",
      type: "danger",
      icon: { icon: "danger", position: "left" },
      duration: 3000,
    });
  }
  render() {
    const { navigation } = this.props;

    return (
      <Block flex middle>
        <ImageBackground source={Images.RegisterBackground} style={{ width, height, zIndex: 1 }}>
          <Block flex middle>
            <Block style={styles.loginContainer}>
              <Text color="white" size={32} style={{ margin: 40, alignItems: "center" }}>
                Welcome back
              </Text>
              <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                <Input
                  autoFocus
                  borderless
                  keyboardType="email-address"
                  name="email"
                  placeholder="Email"
                  onChangeText={(text) => this.setState({ email: text, error: "" })}
                  iconContent={<Icon size={16} color={argonTheme.COLORS.ICON} name="ic_mail_24px" family="ArgonExtra" style={styles.inputIcons} />}
                />
              </Block>
              <Block width={width * 0.8}>
                <Input
                  password
                  borderless
                  placeholder="Password"
                  onChangeText={(text) => this.setState({ password: text, error: "" })}
                  iconContent={
                    <Icon size={16} color={argonTheme.COLORS.ICON} name="padlock-unlocked" family="ArgonExtra" style={styles.inputIcons} />
                  }
                />
                {/* <Block row style={styles.passwordCheck}>
                        <Text size={12} color={argonTheme.COLORS.MUTED}>
                          password strength:
                        </Text>
                        <Text bold size={12} color={argonTheme.COLORS.SUCCESS}>
                          {" "}
                          strong
                        </Text>
                      </Block> */}
              </Block>

              <Block middle width={width * 0.8}>
                <Button color="primary" style={{ width: width * 0.8, marginTop: 50 }} mode="contained" onPress={this.loginUser}>
                  {
                    (this.state.isSending) ? (
                      <Text bold size={18} color={argonTheme.COLORS.WHITE}>
                    Authenticating ...
                  </Text>
                    ) : (
                      <Text bold size={18} color={argonTheme.COLORS.WHITE}>
                    Authenticate
                  </Text>
                    )
                  }
                  
                </Button>
              </Block>
              <View style={styles.row}>
                <Text color={argonTheme.COLORS.WHITE}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 5,
  },
  forgot: {
    fontSize: 13,
    color: theme.COLORS.primary,
  },
  link: {
    fontWeight: "bold",
    color: "#036ffc",
  },
});

export default Login;
