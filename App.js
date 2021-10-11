import React from "react";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

// Redux
import { createStore } from "redux";
import allReducers from "./redux/reducers";
import { Provider } from "react-redux";

// Redux or AsyncStorage?
const store = createStore(
  allReducers,
  // Redux Devtools Extension
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Components (not on bottomTabNavigator)
import Main from "./components/Main";
import PlayExercise from "./components/PlayExercise";
import Exercises from "./components/main/Exercises";
import EquipmentPicker from "./components/main/Create/Exercise/EquipmentPicker";
import ExercisePicker from "./components/main/Create/Workout/ExercisePicker";
import Create from "./components/main/Create";
import WorkoutPage from "./components/main/Workouts/WorkoutPage";
import EditExercise from "./components/main/Create/Exercise/EditExercise";
import EditWorkout from "./components/main/Create/Workout/EditWorkout";
import PlayWorkout from "./components/PlayWorkout";

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="PlayExercise" component={PlayExercise} />
          <Stack.Screen name="Exercises" component={Exercises} />
          <Stack.Screen name="EquipmentPicker" component={EquipmentPicker} />
          <Stack.Screen name="ExercisePicker" component={ExercisePicker} />
          <Stack.Screen name="Create" component={Create} />
          <Stack.Screen name="WorkoutPage" component={WorkoutPage} />
          <Stack.Screen name="EditExercise" component={EditExercise} />
          <Stack.Screen name="EditWorkout" component={EditWorkout} />
          <Stack.Screen name="PlayWorkout" component={PlayWorkout} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
