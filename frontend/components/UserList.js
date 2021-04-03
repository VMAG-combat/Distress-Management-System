import React, {useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

// import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from "react-native-flash-message";
// import { useNavigation } from '@react-navigation/native';

import ENV from '../env.'
import {theme} from 'galio-framework'
import axios from  'axios';
// import VerifiedUser from '../../constants/VerifiedUser';


const UserList = (props) => {
    const { item, followHandler } = props;
    const [imageUri, setImageUri] = useState()


    // const loggedInUserId = useSelector(state => state.auth.user._id);
    // const allUsers = useSelector(state => state.users.allUsers);
    // const loggedInUser = allUsers.filter(u => u._id === loggedInUserId)[0];

    // const dispatch = useDispatch();
    // const navigation = useNavigation();

    const onImageErrorHandler = () => {
        setImageUri(ENV.defaultImageUri);   
    }

    // const checkFollow = (userId) => {
    //     const isFollowed = loggedInUser.following.filter(f => f._id === userId).length !== 0;
    //     return isFollowed;
    // }

    const followUserHandler = () => {
        // if(checkFollow(item.id)){
        //     followHandler(item.id);
        //     showMessage({
        //         message: `Your are already following ${item.name}.`,
        //         type: "success",
        //         duration: 3000,
        //         icon: { icon: "success", position: 'left' }
        //     });
        // } else {
            
            try {
                // const result = await dispatch(usersActions.fetchFindPeopleUsers());
                console.log("hi")
                axios.put(`${ENV.apiUrl}/user/addfriend`,{
                    
                        userId: props.userid,
                        friendId: item.id
                  }).then(res => {
                      console.log(res.data);
                      if(!res.data.message){  
                        console.log("Friend added successfully"); 
                        // setData(res.data.users);
                        followHandler(item.id);
            showMessage({
                message: `Your are now following ${item.name}.`,
                type: "success",
                duration: 3000,
                icon: { icon: "success", position: 'left' }
            });
                        // setAllData(res.data.events);
                      }else{
                        console.log("Error in fetching user events");
                        // setError("Error in fetching user details");
                      }
                  });
                // setData(result);
            } catch (err) {
                console.log(err.message)
                // setError(err.message);
            }
            
            
        // }
    }

    return (
        <TouchableOpacity 
            // onPress={() => navigation.navigate('UserProfile', {userId: item._id, name: item.name} )}
            style={styles.card}
        >
            <Image 
                style={styles.userImage} 
                source={{ uri: ENV.defaultImageUri }}
                onError={onImageErrorHandler}
            />
            <View style={styles.cardFooter}>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text
                        // onPress={() => navigation.navigate('UserProfile',{ userId: item._id, name: item.name} )}
                        style={{...styles.name, marginRight: 10}}
                    >
                        {item.name.length > 10 ? (
                            <>{item.name.substring(0,10)}... </>
                        ) : (
                            <>{item.name + " "}</>
                        )}
                        {/* {
                            VerifiedUser.verifiedUsersId.includes(item._id) && <Octicons name="verified" size={20} color={Colors.brightBlue} />
                        } */}
                    </Text>
                    <Text style={styles.position}>
                        {item.email.length > 15 ? (
                            <>{item.email.substring(0,13)}...</>
                        ) : (
                            <>{item.email}</>
                        )}
                    </Text>
                    <TouchableOpacity style={styles.followButton}>
                        <Text
                            onPress={followUserHandler}
                            style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,

        marginVertical: 5,
        backgroundColor: "white",
        flexBasis: '46%',
        marginHorizontal: 5,
        borderRadius: 25
    },
    cardFooter: {
        paddingVertical: 17,
        paddingHorizontal: 16,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    cardContent: {
        paddingVertical: 12.5,
        paddingHorizontal: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12.5,
        paddingBottom: 25,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
    },
    userImage: {
        height: 120,
        width: 120,
        borderRadius: 60,
        marginTop: 20,
        alignSelf: 'center',
        borderColor: "#DCDCDC",
        borderWidth: 3,
        backgroundColor: '#c2c2c2'
    },
    name: {
        fontSize: 18,
        flex: 1,
        alignSelf: 'center',
        color: "#008080",
        fontWeight: 'bold'
    },
    position: {
        fontSize: 14,
        flex: 1,
        alignSelf: 'center',
        color: "#696969"
    },
    followButton: {
        marginTop: 10,
        height: 35,
        width: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "blue"
    },
    followButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
    },
    icon: {
        height: 20,
        width: 20,
    }
});

export default UserList;