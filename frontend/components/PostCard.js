import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform, Alert, TouchableNativeFeedback, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


import ENV from '../env.';
import axios from 'axios';

import { showMessage } from "react-native-flash-message";
import { argonTheme } from '../constants';


const PostCard = (props) => {
    const { post, userId } = props;
    
    const navigation = useNavigation();

    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageUri, setImageUri] = useState('')
    const [showFullBody, setShowFullBody] = useState(false);
    const [imgWidth, setImgWidth] = useState();
    const [imgHeight, setImgHeight] = useState();
    const [postUser,setPostUser] = useState('')

    const onImageErrorHandler = () => {
        setImageUri(ENV.defaultImageUri)
    }


    let TouchableComp = TouchableOpacity;
    if(Platform.OS === 'android' && Platform.Version >= 21){
        TouchableComp = TouchableNativeFeedback;
    }


    const deleteHandler = (id) => {

        Alert.alert(
            'Are you sure?', 
            'Do you really want to delete this post?',
            [
                {text: 'No', style: 'default'},
                {
                    text: 'Yes', 
                    style: 'destructive', 
                    onPress: async () => {
                        axios({
                            method: 'DELETE',
                            url: `${ENV.apiUrl}/social/post/`+id,
                          }).then((response) => {
                            // console.log(response.data.posts)
                            showMessage({
                                message: "Your post was successfully deleted.",
                                type: "success",
                                icon: { icon: "success", position: 'left' },
                                duration: 3000
                            });

                          }).catch((error) => {
                            // this.setState({
                            //   message: error.response.data.error,
                              
                            // });
                            showMessage({
                                message: "Error Deleting Post",
                                type: "danger",
                                icon: { icon: "danger", position: 'left' },
                                duration: 3000
                            });
                          });
                       
                       
                    }
                }
            ]
        )
    };

    const checkLike = () => {
        let match = post.likes.indexOf(userId) !== -1;
        return match;
    }

    const toggleLike = async () => {
        // props.toggleLikeHandler(post._id, checkLike());
    }

    useEffect(() => {
        if(post.photo){
        let imageUrl = `${ENV.apiUrl}/social/post/photo/${post.id}`;
        Image.getSize(imageUrl, (width, height) => {
            // calculate image width and height 
            const screenWidth = Dimensions.get('screen').width
            const scaleFactor = width / screenWidth
            const imageHeight = height /(scaleFactor)
            setImgWidth(screenWidth);
            setImgHeight(imageHeight);
        })
    }
    axios.get(`${ENV.apiUrl}/user/getprofile/` + post.userId)
    .then((user) => {
        
        setPostUser(user.data.user.name)
        
      })
      .catch((error) => {
        console.log("Something went wrong",error)
      });
    }, [])


    return (
        <TouchableComp 
            background={ Platform.OS === 'ios' ? undefined : TouchableNativeFeedback.Ripple('#b3b3b3') }
            
        >
            <View style={styles.card}>
                {post.userId != userId && (
            <View style={styles.cardTitleHeader}>
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'row' }} >
                        <View style={styles.timeContainer}>
                            <Image
                                style={styles.userIcon} 
                                // source={{ uri: imageUri || `${ENV.apiUrl}/user/photo/${post.postedBy._id}?${new Date(post.postedBy.updated)}` }}
                                source={{ uri: ENV.defaultImageUri }}
                                onError={onImageErrorHandler}
                            />
                            <Text 
                            bold
                                style={{ fontSize: 15, alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 5 ,color:argonTheme.COLORS.BLACK }} 
                               // onPress={() => navigation.navigate('UserProfile', { userId: post.postedBy._id, name: post.postedBy.name })} 
                            > 
                                {postUser + " "}
                                {/* {
                                    VerifiedUser.verifiedUsersId.includes(post.postedBy._id) && <Octicons name="verified" size={18} color={Colors.brightBlue} />
                                } */}
                            </Text>
                        </View>
                        {/* <View style={{ position: 'absolute', right: 0, display: 'flex', flexDirection: 'row'}}>
                            <Ionicons 
                                name={ Platform.OS === 'android' ? 'md-time' : 'ios-time' }
                                size= {14}
                                style={{ marginTop: 3 }}
                            />
                            <Text> {timeDifference(new Date(), new Date(post.created))} </Text>
                        </View> */}
                    </View>
                </View>
                )}
                { post.photo && 
                <View style={styles.cardImageContainer} >
                    <Image 
                    resizeMethod='auto'
                    resizeMode='contain'
                        style={{...styles.cardImage, height:300,}}
                        source={{ uri: `${ENV.apiUrl}/social/post/photo/${post.id}` }}
                        onLoad={() => setIsImageLoading(false)}
                    />
                    <ActivityIndicator 
                        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} 
                        animating={isImageLoading} 
                        size='large' 
                    />
                </View>
                }
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.title}>{post.title}</Text>
                        { post.caption.length > 30 ? (
                            <View>
                                { showFullBody ? (
                                    <Text style={styles.description}> 
                                        {post.caption} 
                                        <Text
                                            
                                            onPress={() => setShowFullBody((prevState) => !prevState)} 
                                        >
                                            Read Less
                                        </Text>
                                    </Text>
                                ) : (
                                    <Text style={styles.description}> 
                                        {post.caption.substring(0, 30)}
                                        <Text
                                           
                                            onPress={() => setShowFullBody((prevState) => !prevState)} 
                                        >
                                            ...Read More
                                        </Text>
                                    </Text>
                                ) }

                            </View>
                        ) : (
                            <Text style={styles.description}> {post.caption} </Text>
                        ) }
                        
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.socialBarContainer}>
                        <View style={styles.socialBarSection}>
                            <TouchableOpacity 
                                style={styles.socialBarButton}
                                // onPress={toggleLike}
                            >
                                <Ionicons 
                                    name="md-thumbs-up"
                                    size={24}
                                    style={{ marginRight: 5 }}
                                    color="black"
                                    // color={checkLike() ? 'blue' : "black"}
                                />
                                <Text style={styles.socialBarLabel}> {post.likes.length} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.socialBarSection}>
                            <TouchableOpacity 
                                style={styles.socialBarButton}
                                onPress={() => navigation.navigate('Comments',{ postId: post.id, userId: userId })}
                            >
                                <Ionicons 
                                    name="chatbubbles"
                                    size={24}
                                    style={{ marginRight: 5 }}
                                />
                                <Text style={styles.socialBarLabel}> {post.comments.length} </Text>
                            </TouchableOpacity>
                        </View>
                        
                        
                    </View>
                </View>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Comments', { postId: post.id, userId: userId })}
                >
                </TouchableOpacity>
                { post.userId === userId ? (
                    <View style={styles.postActions} >
                        <View style={styles.socialBarSection}>
                            <TouchableOpacity 
                                style={styles.socialBarButton}
                                onPress={deleteHandler.bind(this, post.id)}
                            >
                                <MaterialCommunityIcons 
                                    name="delete"
                                    size={20}
                                    style={{ marginRight: 5 }}
                                    color="red"
                                />
                                <Text style={styles.socialBarLabel}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.socialBarSection}>
                            <TouchableOpacity 
                                style={styles.socialBarButton}
                                // onPress={() => navigation.navigate('EditPost', { postId: post.id })}
                            >
                                <MaterialCommunityIcons 
                                    name="square-edit-outline"
                                    size={20}
                                    style={{ marginRight: 5 }}
                                    // color={Colors.lightAccent}
                                />
                                <Text style={styles.socialBarLabel}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                
                ):null}
            </View>
    
        </TouchableComp>
    );
};

const styles = StyleSheet.create({
    userIcon: {
        height: 30,
        width: 30,
        borderRadius: 30,
    },
    card: {
        width: '100%',
        elevation: 3,
        shadowColor: 'black',
        
        shadowOffset: {
            width: 2,
            height: 5
        },
        shadowRadius: 8,
        marginVertical: 8,
        backgroundColor: "#f7f7f7",
        paddingHorizontal:4,
        borderRadius:20,
    },
    cardTitleHeader: {
        paddingVertical: 15,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardHeader: {
        paddingTop: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardContent: {
        paddingVertical: 12.5,
        paddingHorizontal: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
    },
    cardImageContainer: { 
        backgroundColor: "#f7f7f7", 
        flex: 1, 
        display: 'flex',
        borderRadius:20,
        // paddingTop: 5,
        // height: 275 
    },
    cardImage: {
        flex: 1,
        paddingTop:10,
        borderRadius:4,
        // height: 275,
        // width: null
    },
    /******** card components **************/
    title: {
        fontSize: 18,
        flex: 1,
    },
    description: {
        fontSize: 15,
        color: "#888",
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
    },
    time: {
        fontSize: 13,
        color: "#808080",
        marginTop: 5
    },
    icon: {
        width: 25,
        height: 25,
    },
    iconData: {
        width: 15,
        height: 15,
        marginTop: 5,
        marginRight: 5
    },
    timeContainer: {
        flexDirection: 'row'
    },
    /******** social bar ******************/
    socialBarContainer: {
        flexDirection: 'row'
    },
    socialBarSection: {
        marginRight: 20
    },
    socialBarlabel: {
        marginLeft: 20
    },
    socialBarButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postActions: {
        borderTopColor: '#c2c2c2',
        borderTopWidth: 1,
        flexDirection: 'row',
        padding: 15,
    }
})

export default PostCard;