import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceStorage = {
  async saveKey(key, valueToSave) {
    try {
      await AsyncStorage.setItem(key, valueToSave);
    } catch (error) {
      console.log("AsyncStorage Error: " + error.message);
    }
  },

  async loadJWT() {
    try {
      const token = await AsyncStorage.getItem("id_token");
      if (token !== null) {
        const value = await AsyncStorage.getItem(token);
        this.setState({
          jwt: token,
          id: value,
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    } catch (error) {
      console.log("AsyncStorage Error: " + error.message);
    }
  },
  async loadCoords(){
    try{
      const lat = await AsyncStorage.getItem("latitude");
      const long = await AsyncStorage.getItem("longitude");
      if(lat !== 0 && long !== 0){
        return [lat,long]
      }
      return ""
    } catch(error){
      console.log("AsyncStorage Error: " + error.message);
    }
  },
  async getId() {
    const token = await AsyncStorage.getItem("id_token");
    if (token !== null) {
      const value = await AsyncStorage.getItem(token);
      return value;
    }
    return "";
  },
  async loadID() {
    try {
      const token = await AsyncStorage.getItem("id_token");

      const value = await AsyncStorage.getItem(token);

      if (value !== null) {
        // console.log(value)
        this.setState({
          id: value,
          loading: false,
        });
        // console.log(this.state)
      } else {
        this.setState({
          loading: false,
        });
      }
      // console.log(this.state)
    } catch (error) {
      console.log("AsyncStorage Error: " + error.message);
    }
  },
  async deleteJWT() {
    try {
      await AsyncStorage.removeItem("id_token").then((res) => {
        
        this.setState({
          jwt: "",
        });
      });
      await AsyncStorage.clear();
    } catch (error) {
      console.log("AsyncStorage Error: " + error.message);
    }
  },
  async getHelpers() {
    const token = await AsyncStorage.getItem("helpers");
    if (token !== null) {
      
      return token;
    }
    return "";
  },
  async deleteHelpers() {
    try {
      await AsyncStorage.removeItem("helpers")
    } catch (error) {
      console.log("AsyncStorage Error: " + error.message);
    }
  },
  async getEmergencyContacts() {
    const token = await AsyncStorage.getItem("emergency_contacts");
    if (token !== null) {
      
      return token;
    }
    return "";
  },

};

export default deviceStorage;
