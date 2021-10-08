import React, { useEffect } from "react";

// Navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

// Vector Icons
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Redux
import { useDispatch } from "react-redux";
import { fetchLocalData, fetchLocalWorkouts } from "../redux/actions";

// Mainpages Components
import Workouts from "./main/Workouts";
import Exercises from "./main/Exercises";
import Create from "./main/Create";
import Profile from "./main/Profile";

function Main() {
  // Get Local Data from AsyncStorage and load it to global state (redux)
  const dispatch = useDispatch();
  useEffect(() => {
    const getLocalData = async (localKey) => {
      try {
        const jsonData = await AsyncStorage.getItem(localKey);
        return jsonData != null ? JSON.parse(jsonData) : null;
      } catch (err) {
        console.log(err);
      }
    };

    getLocalData("exercises").then((exercises) =>
      dispatch(fetchLocalData(exercises))
    );

    getLocalData("workouts").then((workouts) =>
      dispatch(fetchLocalWorkouts(workouts))
    );
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{
        style: { color: "red" },
        activeTintColor: "yellow",
        inactiveBackgroundColor: "black",
        activeBackgroundColor: "black",
        inactiveTintColor: "white",
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Workouts"
        component={Workouts}
        options={{
          tabBarLabel: "Workouts",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weight-lifter"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Exercises"
        component={Exercises}
        options={{
          tabBarLabel: "Exercises",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarLabel: "Create",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Main;
