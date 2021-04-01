import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { showMessage } from "react-native-flash-message";

import { emailValidator } from '../helpers/emailValidator'
import { nameValidator } from '../helpers/nameValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import * as authActions from '../store/actions/auth';
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import ENV from '../env.';
// import { Timestamp } from "@google-cloud/firestore";

const { width, height } = Dimensions.get("screen");

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignup:false,
      name:"",
      email: "",
      password: "",
      phone:"",
      address:"",
      otp:""
    };
    
  }

  // sendOTP = () =>{
  //   return(
  //     <Block flex middle>
  //       <Input
  //       placeholder="Verification Code"
  //       keyboardType='numeric'
  //       value={this.state.otp}
  //       onChangeText={(otp)=> {this.setState({otp:otp})}}
  //       maxLength={6}
  //       />
  //       <TouchableOpacity >
  //             <Text>Verify</Text>
  //           </TouchableOpacity>
  //     </Block>
  //   )
  // }
  
  

  render() {

    
    // const dispatch = useDispatch(); 

    // const verifyOTP = async () => {
    //   try {
    //     const otp = await dispatch(authActions.otpVerify(name, email, password, phone, address))

    //   } catch (error) {
        
    //   }
    // }
    // const sendOTP = () =>{
    //   return(
    //     <Block flex middle>
    //       <Input
    //       placeholder="Verification Code"
    //       keyboardType='numeric'
    //       value={this.state.otp}
    //       onChangeText={(otp)=> {this.setState({otp:otp})}}
    //       maxLength={6}
    //       />
    //       <TouchableOpacity onPress={onRegisterPressed}>
    //             <Text>Verify</Text>
    //           </TouchableOpacity>
    //     </Block>
    //   )
    // }
    const {navigation} = this.props; 
    const onRegisterPressed= async () => {
        
      // const {navigation} = this.props; 
      const nameError = nameValidator(this.state.name)
      const emailError = emailValidator(this.state.email)
      const passwordError = passwordValidator(this.state.password)
      console.log(this.state)
      // navigation.navigate('Otp');
      if (emailError || passwordError || nameError) {
          this.setState({...this.state.email,...this.state.password, ...this.state.name, emailError,passwordError, nameError})
  
     
        return(
          showMessage({
            message: "Please Enter Valid Details!",
            type: "danger",
            icon: { icon: "danger", position: 'left' },
            duration: 3000
        })
            // Alert.alert(
            //     "Error!!!",
            //     nameError+"\n"+emailError +"\n"+passwordError,
            //     [
            //       {
            //           text: 'Ok',
            //           onPress: () => console.log('Cancel Pressed'),
            //           style: 'cancel'
            //         },
            //     ]
            // )
        );
      }
      else{
        try {
          console.log("hi")
          const {name, email,password,phone,address} = this.state
          // const otp = await authActions.otpVerify(name, email, password, phone, address)
          await fetch(`${ENV.apiUrl}/auth/sendotpForRegister`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email:email,
                password: password,
                phone: phone,
                address:address,

            })
        })
        .then((response) => response.json())
        .then((resData) => {
          console.log(resData)
          if(resData.error){
            console.log("k")
            showMessage({
              message: resData.error,
              type: "danger",
              icon: { icon: "danger", position: 'left' },
              duration: 3000
          })
            throw new Error(resData.error);
        }
          else{
            console.log("otp: "+resData.otp)
            this.setState({
              isSignup:true,
              otp: resData.otp,
              name: "",
              email: "",
              phone:"",
              address:""
            })
            navigation.navigate('Otp',{otp: this.state.otp, isSignUp: this.state.isSignup, name:name, email:email, password:password, phone:phone,address:address});
            showMessage({
              message: " Please Enter the OTP sent to your mobile number for verification.",
              type: "success",
              icon: { icon: "success", position: 'left' },
              duration: 3000
          })
          }
        })
        // console.log(otp)
          // this.setState({
          //   isSignup:true,
          //   otp: otp,
          //   name: "",
          //   email: "",
          //   phone:"",
          //   address:"",
          //   password:""
          // })
          // navigation.navigate('Otp',{otp: this.state.otp});
        } catch (error) {
          showMessage({
            message: error.message,
            type: "danger",
            icon: { icon: "danger", position: 'left' },
            duration: 3000
        });
        }
      }
      
      }
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              {/* <Block flex={0.25} middle style={styles.socialConnect}>
                <Text color="#8898AA" size={12}>
                  Sign up with
                </Text>
                <Block row style={{ marginTop: theme.SIZES.BASE }}>
                  <Button style={{ ...styles.socialButtons, marginRight: 30 }}>
                    <Block row>
                      <Icon
                        name="logo-github"
                        family="Ionicon"
                        size={14}
                        color={"black"}
                        style={{ marginTop: 2, marginRight: 5 }}
                      />
                      <Text style={styles.socialTextButtons}>GITHUB</Text>
                    </Block>
                  </Button>
                  <Button style={styles.socialButtons}>
                    <Block row>
                      <Icon
                        name="logo-google"
                        family="Ionicon"
                        size={14}
                        color={"black"}
                        style={{ marginTop: 2, marginRight: 5 }}
                      />
                      <Text style={styles.socialTextButtons}>GOOGLE</Text>
                    </Block>
                  </Button>
                </Block>
              </Block> */}
              <Block flex>
                <Block flex={0.17} middle>
                  <Text color="#8898AA" size={24}>
                    Bachao Registration
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Name"
                        keyboardType="default"
                        onChangeText={(text) => this.setState({name: text,error: ''})}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="person"
                            family="Ionicon"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Email"
                        keyboardType="email-address"
                        onChangeText={(text) => this.setState({email: text,error: ''})}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        password
                        borderless
                        placeholder="Password"
                        onChangeText={(text) => this.setState({password: text,error: ''})}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
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
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Phone No"
                        keyboardType="number-pad"
                        onChangeText={(text) => this.setState({phone: text,error: ''})}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="call"
                            family="Ionicon"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Address"
                        keyboardType="default"
                        onChangeText={(text) => this.setState({address: text,error: ''})}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="home"
                            family="Ionicon"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block row width={width * 0.75}>
                      <Checkbox
                        checkboxStyle={{
                          borderWidth: 3
                        }}
                        color={argonTheme.COLORS.PRIMARY}
                        label="I agree with the Privacy Policy"
                      />

                      {/* <Button
                        style={{ width: 100 }}
                        color="transparent"
                        textStyle={{
                          color: argonTheme.COLORS.PRIMARY,
                          fontSize: 14
                        }}
                      >
                        Privacy Policy
                      </Button> */}
                    </Block>
                    <Block middle>
                      <Button color="primary" style={styles.createButton} onPress={onRegisterPressed}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          CREATE ACCOUNT
                        </Text>
                      </Button>
                    </Block>
                    {/* {this.state.isSignup ? this.sendOTP() : false} */}
                  </KeyboardAvoidingView>
                </Block>
              </Block>
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
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});

export default Register;
