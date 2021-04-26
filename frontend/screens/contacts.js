import React, {useState,useEffect, useCallback} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';


import axios from 'axios';
import {Icon} from "."
import ENV from '../env.'
import { Container, Header, Item, Input, CheckBox,Button } from 'native-base';
import deviceStorage from "../services/deviceStorage.js"

const AddContacts = (props) => {

    // const findPeopleUsers = useSelector(state => state.users.findPeople);

    
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(true);
    const [error, setError] = useState();
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [alldata, setAllData] = useState([]);

    
    // const dispatch = useDispatch();

    

    const loadFindPeople = useCallback(() => {

        setError(null);
        
        if(data.length===0){
            // setIsRefreshing(true)
        var num=[];
        var contact =[]
        var name=[]
        var id=0;
        for(const c of props.route.params.contacts){
            num=[]
            for(const p of c.phoneNumbers){
                // console.log(p.id)
                if(!num.includes(p.number))
                num.push(p.number)
            }
            if(!name.includes(c.givenName+" "+c.middleName+" "+c.familyName) && num.length!==0){
                name.push(c.givenName+" "+c.middleName+" "+c.familyName)
            
            contact.push({
                "id":id,
                "name": c.givenName+" "+c.middleName+" "+c.familyName,
                "numbers":num,
                "checked":false
            })
            id +=1
        }
        
        }
      

        const sortContacts = [].slice.call(contact).sort((a,b)=>{ return b.name< a.name})
        data.push(sortContacts)
        
        setData(data)
        setAllData(data)
        setIsRefreshing(false)
    }else{
        setIsRefreshing(true)
        
        
        setData(data)
        setIsRefreshing(false)
    }
    
    }, [setIsLoading, setError])

    
    useEffect(() => {
        setIsLoading(true);
        loadFindPeople()
        // .then(() => {
        //     setIsRefreshing(false);
        // });
        setIsLoading(false)
    }, [loadFindPeople])


    const handleSearchTextChange = (text) => {
        setSearchText(text);
        
        if(text !== ''){
            console.log(text,"hi")
            let filteredData = []
            let currData = data[0];

            filteredData = currData.filter(item => {
                const lc = item.name.toLowerCase();
                text = text.toLowerCase();
                return lc.includes(text);
            });
            setData([filteredData]);
        } else {
            loadFindPeople()
        }
    }

    // const add = (id) =>{
    //     setIsRefreshing(true)
    //     let searchData = data;
    //     searchData = searchData.filter(i => i.id === id);
    //     props.helpers(searchData[0].email)
    //     if(!helpers.includes(searchData[0].email))
    //     setHelpers([...helpers,searchData[0].email])
    //     let viewData = data;
    //     viewData = viewData.filter(i => i.email!==searchData[0].email);
    //     setData(viewData);
        
    //     setIsRefreshing(false)
        
    // }

    const add =()=>{
        var emergencyContacts = data[0].filter(i=>i.checked===true)
        console.log("emergency",emergencyContacts)
        axios.put(`${ENV.apiUrl}/user/addemergencycontacts`,{
            userId: props.route.params.userId,
            emergencyContacts:emergencyContacts
        }).then((response) => {
            
            // console.log(response.data.helpers);
            if(response.data.userid)
            
            console.log("Contacts Registered!!!")
          })
          .catch((error) => {
            console.log(error);
          });
        
        props.navigation.goBack();
    }
    const followHandlerForData = (id) => {
        //follow handler to remove item from search data i.e. data state
        let searchData = data;
        searchData = searchData.filter(i => i.id !== id);
        setData(searchData);
    }

    const toggleCheckbox = (id) => {
        let data1 = alldata[0];
        var index = alldata[0].findIndex(i => i.id===id)
        // console.log(index, data[index])
        // console.log(!data[index].checked)
        alldata[0][index].checked = !(alldata[0][index].checked)
        console.log("klkl",alldata.length)
        setData(alldata)
        console.log(alldata[0].filter(i=>i.checked===true))
    }


    if(error){
        return (
            <View style={styles.centered} >
                <Text>An error occured.</Text>
                <Button onPress={loadFindPeople} >
                    <Text>Try again</Text>
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
        // <></>
        
        <Container style={{ backgroundColor: '#fff',marginTop:65 }}>
            <Header style={{ backgroundColor: "#fff" }} searchBar rounded>
                <Item>
                
                <Input
                     
                         value={searchText}
                         onChangeText={(text) => handleSearchTextChange(text)}
                         placeholder="Search Contacts by name" 
                     />
                     {/* <Icon name="ios-people" /> */}
                </Item>
             </Header>
       
   
   
             <View style={styles.container}>
            <FlatList
                // style={styles.list}
                refreshing={isRefreshing}
                onRefresh={loadFindPeople}
                // contentContainerStyle={styles.listContainer}
                data={data[0]}
                // horizontal={false}
                // numColumns={2}
                keyExtractor={(item,index) => {
                    index
                }}
                renderItem={({ item }) => (
                    <>
                        
                    <View style={styles.content}>
                    <CheckBox
                    key={item.id}
          checked={item.checked}
          color="purple"
        //   onValueChange={setSelection}
          onPress={() => toggleCheckbox(item.id)}
           />
                    <View style={styles.mainContent}>
                    
                        <TouchableOpacity onPress={()=>{}}>
                        <View style={styles.text}>
                            <Text
                                
                                style={styles.name}
                            >
                                
                                { item.name}
                               
                            </Text>
                        </View>
                        <Text style={styles.timeAgo}>
                            Phone Nos : 
                            {/* {
                [].slice.call(item.phoneNumbers).forEach(phone =>{ 
                  <Text >{phone.number + "\t"}</Text>  
                })
              } */}
              <Text>{item.numbers[0]}</Text>
                        {/* {item.numbers.map(phone => 
                                       (
                <Text> {phone + " \t "}</Text>
              ))} */}
                        </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                </>
                )} 
            />
            
            </View> 
            <View style={{position:'absolute',bottom:15,width:'100%'}}>
            <Button onPress={()=>add()} block primary style={{height:50}}><Text style={{fontSize:24, fontWeight:"bold", color:"#fff"}}>SAVE</Text></Button>
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
        // position:'absolute',
        // top:160,
        padding: 16,
        width:'100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: "#FFFFFF",
        alignItems: 'flex-start',
        marginBottom:100,
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
          
        flex: 1,
        flexDirection:'row',
        padding:10,
        borderBottomWidth: 2,
        borderColor: "#FFFFFF",
        // marginLeft: 100,
        marginRight: 0,
        backgroundColor:"#f7f7f8"
      },
      mainContent: {
        marginRight: 0,
        marginLeft:20
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

export default AddContacts;