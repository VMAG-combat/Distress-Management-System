import React from 'react';
import { StyleSheet, View,Dimensions, ScrollView,FlatList } from 'react-native';
import { Block, theme } from 'galio-framework';
const { width } = Dimensions.get('screen');
import deviceStorage from '../services/deviceStorage.js'; 
import axios from 'axios';
import ENV from '../env.'
import ListIncident from "../components/ListIncident";


class Incident extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRefreshing:false,
      incident: '',
      message:'',
      allusers:''
    }
    
  }
  componentDidMount(){
    
    deviceStorage.getId().then((userId) => {
    axios.get(`${ENV.apiUrl}/user/getallusers/`+userId)
    .then((response)=>{
        
        this.setState({
          allusers: response.data.users
        })
    }).catch((error)=>{
        console.log(error);
    })
  })
  
      this.loadIncident();
  }

  loadIncident = () => {
    this.setState({
      isRefreshing: true
    })
    
   deviceStorage.getId().then((userId) => {
    
      axios.get(`${ENV.apiUrl}/incident/getIncidentByUser/` + userId)
    .then((response) => {
      
        this.setState({
          incident:response.data.incidents,
          message: response.data.message,
          isRefreshing:false
        });
        
      })
      .catch((error) => {
        this.setState({
          message: "Error retrieving data",
          isRefreshing:false
        });
      });
  });
}



 
  render(){
    const { message,incident,allusers} = this.state;
    const sortincident = [].slice.call(incident).sort((a,b)=>{ return b.datetime> a.datetime})
    
    return (
      <Block flex center style={styles.home}>
        <View style={styles.container}>
            <FlatList
            onRefresh={this.loadIncident}
            refreshing={this.state.isRefreshing}
            data={sortincident}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => {
              return (
                  <View style={styles.separator} />
              )
          }}
            renderItem={(incident) => (
              
                <ListIncident incident={incident.item} allusers={allusers}/>
            )}
            />
            </View>
       </Block>
     
    )
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  container: {
    flexDirection: 'row',
    marginTop:"25%",
    marginBottom:"10%",
    // paddingBottom:20,
    alignItems: 'flex-start',
  },
  separator: {
    marginTop: 10
},
});

export default Incident;
