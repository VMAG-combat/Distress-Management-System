import { AsyncStorage } from "react-native";

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
        console.log(res);
        this.setState({
          jwt: "",
        });
      });
    } catch (error) {
      console.log("AsyncStorage Error: " + error.message);
    }
  },
};

export default deviceStorage;
