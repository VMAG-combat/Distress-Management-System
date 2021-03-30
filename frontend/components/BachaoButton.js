import React from 'react';
import {View,StyleSheet,TouchableHighlight,Text,Image,Animated, Button,Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
class BachaoButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          count:0,
          message:''
        }
        
        // console.log(this.state);
      }
    
    buttonSize = new Animated.Value(1);
    mode = new Animated.Value(0);

    handdlePress = () =>{
        // e.preventDefault();

        
        Animated.sequence([
            Animated.timing(this.buttonSize,{
                toValue:0.6,
                duration:100,
                useNativeDriver:true
            }),
            Animated.timing(this.buttonSize,{
                toValue:1,
                duration:0,
                useNativeDriver:true,
            }),
            // Animated.timing(this.mode, {
            //     toValue: this.mode._value === 0 ? 1 : 0,
            //     duration:300
            // })
        ]).start();
        
        this.setState({
            count: this.state.count+1,
        })
        if(this.state.count>=2){
        console.log("Bachao");
        this.setState({
            count: 0,
        })

        }
    };
    render(){
        const {navigation} = this.props;

        const sizeStyle = {
            transform: [{scale: this.buttonSize}]
        }

        const galleryX = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,-0.0460*height]
        })
        const galleryY = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,-0.04977*height]
        })


        const vibranceX = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,0.016177*height]
        })
        const vibranceY = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,-0.08717*height]
        })


        const contactX = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,0.0784*height]
        })
        const contactY = this.mode.interpolate({
            inputRange: [0,1],
            outputRange: [0.01244*height,-0.04981*height]
        })

        return (
            <View style={{position:'absolute',bottom:0.00622*height, alignItems:'center',backgroundColor:'transparent'}}>
                {/* <Animated.View style={{position:"absolute",left: galleryX, top: galleryY}}>
                    <View style={styles.secondary_button}>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('Merch')}}>
                        <Ionicons name="ios-pricetags" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View style={{position:"absolute",left: vibranceX, top: vibranceY}}>
                    <View style={styles.secondary_button}>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('stats')}}>
                        <Ionicons name="ios-stats" size={24} color="white"/>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View style={{position:"absolute",left: contactX, top: contactY}}>
                    <View style={styles.secondary_button}>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('gallery')}}>
                        <Ionicons name="ios-images" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View> */}
                <Animated.View style={[styles.button,sizeStyle]}>
                    <TouchableHighlight onPress={this.handdlePress} underlayColor={0}>
                        <Animated.View style={{backgroundColor:"#aa2fd6",height:0.1094*height,width:0.1094*height,borderRadius:0.08717*height,justifyContent:'center',alignItems:'center',shadowColor:'black',shadowOffset: {width:0.1244*height,height:0.1244*height},shadowOpacity: 1}}>
                            <Image
                            style={{position:'relative',height:0.1094*height,width:0.1094*height,borderRadius:0.08717*height,borderWidth:1,borderColor: 'white',shadowColor:'black',shadowOffset: {width:0.1244*height,height:0.1244*height},shadowOpacity: 1}}
                            source={require('../assets/icon.png')}
                            />
                        </Animated.View>
                    </TouchableHighlight>     
                </Animated.View>
            </View>
        );
    }
}


const withNavigation = (Component) => {
    return (props) => {
      const navigation = useNavigation();
  
      return <Component navigation={navigation} {...props} />;
    };
  };
export default withNavigation(BachaoButton);


const styles = StyleSheet.create({
    button:{
        
        borderRadius:0.08710*height,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems:'center',
        shadowColor:'black',
        shadowRadius:0,
        shadowOffset:{height:0.0248*height},
        shadowOpacity:1,
        elevation:6
    },
    secondary_button:{
        position:'absolute',
        alignItems:'center',
        justifyContent:'center',
        width:0.1020*width,
        height:0.1020*width,
        borderRadius:0.061*width,
        backgroundColor:'#aa2fd6',
    }
});