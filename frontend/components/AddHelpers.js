import React, {useState,useEffect, useCallback} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    Button,
    TouchableOpacity
} from 'react-native';

import UserList from './UserList';
import axios from 'axios';
import {Icon} from "."
import ENV from '../env.'
import { Container, Header, Item, Input } from 'native-base';
import { argonTheme } from "../constants";

const AddHelpers = (props) => {

    // const findPeopleUsers = useSelector(state => state.users.findPeople);

    // console.log(props)
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);

    const [helpers,setHelpers] = useState([]);
    // const dispatch = useDispatch();

    // console.log(props)

    const loadFindPeople = useCallback(async () => {
        setError(null);
        setData(props.allusers)
    }, [setIsLoading, setError])

    
    useEffect(() => {
        setIsLoading(true);
        loadFindPeople()
        .then(() => {
            setIsLoading(false);
        });
    }, [loadFindPeople])


    const handleSearchTextChange = (text) => {
        setSearchText(text);
        if(text !== ''){
            let filteredData = []
            let currData = data;

            filteredData = currData.filter(item => {
                const lc = item.name.toLowerCase();
                text = text.toLowerCase();
                return lc.includes(text);
            });
            setData(filteredData);
        } else {
            setData(data);
        }
    }

    const add = (id) =>{
        setIsRefreshing(true)
        let searchData = data;
        searchData = searchData.filter(i => i.id === id);
        props.helpers(searchData[0].email)
        if(!helpers.includes(searchData[0].email))
        setHelpers([...helpers,searchData[0].email])
        let viewData = data;
        viewData = viewData.filter(i => i.email!==searchData[0].email);
        setData(viewData);
        
        setIsRefreshing(false)
        
    }

    const followHandlerForData = (id) => {
        //follow handler to remove item from search data i.e. data state
        let searchData = data;
        searchData = searchData.filter(i => i.id !== id);
        setData(searchData);
    }



    if(error){
        return (
            <View style={styles.centered} >
                <Text>An error occured.</Text>
                <Button onPress={loadFindPeople} title="Ty Agan"  >
                    {/* <Text>Try again</Text> */}
                </Button>
            </View>
        );
    }


    if(isLoading){
        return (
            <View style={styles.centered} >
                <ActivityIndicator size='large'  />
            </View>
        );
    }

    return (
        // <>
        <Container style={{ backgroundColor: '#fff' }} >
            <Header style={{ backgroundColor: "#fff" }} searchBar rounded>
                <Item>
                    {/* <Icon name="ios-search" /> */}
                    <Input
                        value={searchText}
                        onChangeText={(text) => handleSearchTextChange(text)}
                        placeholder="Search" 
                    />
                    <Icon name="ios-people" />
                </Item>
            </Header>
   
   {/* </Container> */}
            <View style={styles.container}>
            <FlatList
                // style={styles.list}
                refreshing={isRefreshing}
                onRefresh={loadFindPeople}
                // contentContainerStyle={styles.listContainer}
                data={data}
                // horizontal={false}
                // numColumns={2}
                keyExtractor={(item) => {
                    return item.id;
                }}
                renderItem={({ item }) => (
                    <View style={styles.content}>
                    <View style={styles.mainContent}>
                        <TouchableOpacity onPress={()=>add(item.id)}>
                        <View style={styles.text}>
                            <Text
                                
                                style={styles.name}
                            >
                                
                                { item.name + " " }
                                {/* {
                                    VerifiedUser.verifiedUsersId.includes(user._id) && <Octicons name="verified" size={18} color={Colors.brightBlue} />
                                } */}
                            </Text>
                        </View>
                        <Text style={styles.timeAgo}>
                            { item.email }
                        </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                )} 
            />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30
    },
    container: {
        // flex:1
        padding: 16,
        width:'100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: "#FFFFFF",
        alignItems: 'flex-start',
        marginBottom:50,
      },
    list: {
        paddingHorizontal: 5,
        // backgroundColor: "#E6E6E6",
        backgroundColor: '#fff'
    },
    listContainer: {
        alignItems: 'center'
    },
    text: {
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap:'wrap'
      },
      content: {
          
        // flex: 2,
        padding:10,
        borderBottomWidth: 2,
        borderColor: "#FFFFFF",
        // marginLeft: 100,
        marginRight: 0,
        backgroundColor:"#f7f7f8"
      },
      mainContent: {
        marginRight: 0
      },
      timeAgo:{
        fontSize:12,
        color:"#696969"
      },
      name:{
        fontSize:16,
        color:"#1E90FF"
      }
});

export default AddHelpers;