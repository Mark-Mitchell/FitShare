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
import Landing from "./components/auth/Landing";
import Register from "./components/auth/Register";

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
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
