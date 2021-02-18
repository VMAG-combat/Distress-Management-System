import React, { useState } from 'react'
// import { Alert } from '@react-navigation/native';

import { TouchableOpacity, StyleSheet, View, Dimensions, ImageBackground,Alert } from 'react-native'
import {Text, theme, Block} from 'galio-framework'


import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import {Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";


const { width, height } = Dimensions.get("screen");



class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: ""
        };
        // this.onLoginPressed = this.onLoginPressed.bind(this);
        // this.handleChange = this.handleChange.bind(this);
      }
    render(){
        const {navigation} = this.props; 
        // console.log(this.props.navigation.navigate);
    // const [email, setEmail] = useState({ value: '', error: '' })
    // const [password, setPassword] = useState({ value: '', error: '' })
  
    // const onLoginPressed = () => {
    //   const emailError = emailValidator(email.value)
    //   const passwordError = passwordValidator(password.value)
    //   if (emailError || passwordError) {
    //     setEmail({ ...email, error: emailError })
    //     setPassword({ ...password, error: passwordError })
    //     return
    //   }
    //   navigation.reset({
    //     index: 0,
    //     routes: [{ name: 'Dashboard' }],
    //   })
    // }

    const onLoginPressed=()=>{
        
        const emailError = emailValidator(this.state.email)
        const passwordError = passwordValidator(this.state.password)
        console.log(this.state)
        
        if (emailError || passwordError) {
            this.setState({...this.state.email,...this.state.password, emailError,passwordError})
    
       
          return(
              Alert.alert(
                  "Error!!!",
                  emailError +"\n"+passwordError,
                  [
                    {
                        text: 'Ok',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                      },
                  ]
              )
          );
        }
        navigation.reset({
            index: 0,
            routes: [{ name: 'App' }],
          })
        }
      

    return (
        <Block flex middle>
            <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
            <Block flex middle>
            <Block style={styles.loginContainer}>
          <Text color="white" size={32} style={{margin: 40, alignItems: 'center'}}>Welcome back</Text>
          <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        type='text'
                        name="email"
                        placeholder="Email"
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
            <Block width={width * 0.8}>
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
            
          {/* <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          /> */}
          {/* <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          /> */}
          {/* <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
            >
              <Text style={styles.forgot}>Forgot your password?</Text>
            </TouchableOpacity>
          </View> */}
          <Block middle width={width*0.8}>
          <Button color='primary' style={{width: width*0.8, marginTop: 50}} mode="contained" onPress={onLoginPressed}>
          <Text bold size={18} color={argonTheme.COLORS.WHITE}>
                          Get Started
                        </Text>
          </Button>
          </Block>
          <View style={styles.row}>
            <Text color={argonTheme.COLORS.WHITE}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
          
          </Block>
          </Block>
          </ImageBackground>
          </Block>
      )
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
      forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
      },
      row: {
        flexDirection: 'row',
        marginTop: 5,
      },
      forgot: {
        fontSize: 13,
        color: theme.COLORS.primary,
      },
      link: {
          
        fontWeight: 'bold',
        color: '#036ffc',
      },
    })
    
export default Login
    