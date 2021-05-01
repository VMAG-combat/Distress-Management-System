import React from "react";
import { Easing, Animated, Dimensions, View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Block } from "galio-framework";

// screens
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Element from "../screens/Element";
import SocialMedia from "../screens/SocialMedia";
import BachaoButton from "../components/BachaoButton";
import Incident from '../screens/incident';
import AddContacts from '../screens/contacts'
import Store from "../screens/Store"
// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Icon, Header } from "../components";
import { argonTheme, tabs } from "../constants";
import Map from "../screens/Map";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ElementsStack(props) {
  return (
    <Stack.Navigator initialRouteName="Element" mode="card" headerMode="screen">
      <Stack.Screen
        name="Element"
        component={Element}
        options={{
          header: ({ navigation, scene }) => 
            <Header title="Events" navigation={navigation} scene={scene} />
          ,
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => <Header title="" back white transparent navigation={navigation} scene={scene} />,
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function MapStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          header: ({ navigation, scene }) => <Header title="Map" navigation={navigation} scene={scene} />,
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Incident"
        component={Incident}
        options={{
          header: ({ navigation, scene }) => <Header title="My Incidents" back navigation={navigation} scene={scene} />,
          headerTransparent: true,
          // cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Store"
        component={Store}
        options={{
          header: ({ navigation, scene }) => <Header title="E-Store" back  transparent navigation={navigation} scene={scene} />,
          // headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function SocialMediaStack(props) {
  // console.log(props)
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="SocialMedia"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => <Header title="Social" navigation={navigation} scene={scene} />,
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      {/* <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => <Header title="" back white transparent navigation={navigation} scene={scene} />,
          headerTransparent: true,
        }}
      /> */}
    </Stack.Navigator>
  );
}
function AddContactsScreen({navigation,route}){
  return(
  <AddContacts />
  )
}
function ProfileStack(props) {
  // console.log("PROFILE: \n"+props)
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => <Header transparent white title="Profile" navigation={navigation} scene={scene} />,
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
          // navigation={props.navigation}
        }}
        // navigation={props.navigation}
      />
      <Stack.Screen
        name="Pro"
        component={AddContacts}
        options={{
          header: ({ navigation, scene }) => <Header title="Select Contacts" back navigation={navigation} scene={scene} />,
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Home"
              // search
              // options
              // tabs={[
              //   { id: 'popular', title: 'Popular' },
              //   { id: 'beauty', title: 'Beauty' },
              //   { id: 'fashion', title: 'Fashion' },
              //   // { id: 'car_motorcycle', title: 'Car & Motorcycle' },
              // ]}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => <Header title="" back white transparent navigation={navigation} scene={scene} />,
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  // console.log(props)

  return (
    <Stack.Navigator mode="card" headerMode="none">
      {props.jwt ? (
        <Stack.Screen
          name="App"
          component={AppStack}
          options={{
            jwt: props.jwt,
            // deleteJWT:props.deleteJWT
          }}
          initialParams={{ userId: props.userId }}
        />
      ) : (
        // <>
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          option={{
            headerTransparent: true,
            newJWT: props.newJWT,
          }}
        />
        // </>
      )}
    </Stack.Navigator>
  );
}
const bachaoButton = () => {
  return null;
};
function AppStack(props) {
  return (
    <Tab.Navigator
      style={{ flex: 1, flexDirection: "row" }}
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, horizontal, color }) => {
          let IconComponent = Ionicons;
          let iconName;
          if (route.name === "Map") {
            iconName = "ios-map";
          }
          if (route.name === "Home") {
            iconName = "ios-home";
          } else if (route.name === "Elements") {
            iconName = "ios-calendar";
          } else if (route.name === "SocialMedia") {
            iconName = "planet";
          } else if (route.name === "Profile") {
            iconName = "ios-call";
          }

          // You can return any component that you like here!
          // console.log(tintColor)
          return <IconComponent focused={focused} name={iconName} size={25} color={color} />;
        },
      })}
      tabBarOptions={{
        labelStyle: {
          fontSize: 12,
        },
        showLabel: false,
        activeTintColor: argonTheme.COLORS.ACTIVE, // active icon color
        inactiveTintColor: "#001f30", // inactive icon color
        style: {
          backgroundColor: "#FDFDFD", // TabBar background
          borderTopColor: "white",
        },
      }}
    >
      <Tab.Screen name="Map" component={MapStack} />
      {/* <Tab.Screen name="Home" component={HomeStack} /> */}
      <Tab.Screen name="Elements" component={ElementsStack} />
      {/* <Tab.Screen name="Elemednts"/> */}
      <Tab.Screen
        name="Bachao"
        component={bachaoButton}
        options={{
          tabBarIcon: () => <BachaoButton />,
        }}
      />
      <Tab.Screen name="SocialMedia" component={SocialMediaStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      
    </Tab.Navigator>
  );
}
