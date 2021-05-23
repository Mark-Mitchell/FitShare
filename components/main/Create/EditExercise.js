import React, { useState, useEffect } from "react";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector, useDispatch } from "react-redux";
import { fetchLocalData } from "../../../redux/actions";

import ImagePicker from "./ImagePicker";

function EditExercise(props) {
  const initialState = {
    id: 0,
    name: "",
    description: "",
    equipment: "",
    time: "0",
    image: "",
    moreInfo: "",
    imagePath: "",
  };
  const [state, setState] = useState(initialState);

  const [timeInputStyle, setTimeInputStyle] = useState(styles.input);

  const handleInput = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  // Validate Input every time the state is changed
  useEffect(() => {
    // check if time is number:
    // TODO: Change Input colour and give a warning if NaN
    if (isNaN(state.time)) {
      const errorInputStyle = StyleSheet.flatten([styles.input, styles.error]);
      setTimeInputStyle(errorInputStyle);
    } else {
      setTimeInputStyle(styles.input);
    }
  }, [state]);

  // setTestData for development on mount
  useEffect(() => {
    const setTestData = async () => {
      try {
        const testData = JSON.stringify({
          1: {
            name: "Name 1",
            description: "Description 1",
            equipment: "Bodyweight 1",
            time: 2,
            image: "",
            moreInfo: "",
          },
          2: {
            name: "Name 2",
            description: "Description 2",
            equipment: "Bodyweight 2",
            time: 2,
            image: "",
            moreInfo: "",
          },
          3: {
            name: "Name 3",
            description: "Description 3",
            equipment: "Bodyweight 3",
            time: 2,
            image: "",
            moreInfo: "",
          },
        });
        AsyncStorage.setItem("exercises", testData);
        return;
      } catch (error) {
        console.log(error);
      }
    };

    setTestData();
  }, []);

  // Handle Submit
  const localExercises = useSelector((state) => state.exercises);
  const dispatch = useDispatch();
  const submitForm = async () => {
    try {
      const id = generateId(localExercises);

      // Add to Local Storage
      const newExercise = {
        [id]: {
          ...state,
          id,
        },
      };
      const exercises = {
        ...localExercises,
        ...newExercise,
      };

      await AsyncStorage.setItem("exercises", JSON.stringify(exercises));

      // Reset Form
      setState(initialState);
      // Update global state
      dispatch(fetchLocalData(exercises));
      props.navigation.navigate("Exercises");
      // TODO: give some user feedback
    } catch (error) {
      console.log(error);
    }
  };

  const generateId = (exerciseObjects) => {
    const idArray = Object.keys(exerciseObjects);
    return idArray.length > 0 ? Math.max(...idArray) + 1 : 1;
  };

  return (
    <View>
      <Text>Create a new Exercise</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(value) => handleInput("name", value)}
          value={state.name}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          onChangeText={(value) => handleInput("description", value)}
          value={state.description}
        />
        <TextInput
          style={styles.input}
          placeholder="Equipment Needed"
          onChangeText={(value) => handleInput("equipment", value)}
          value={state.equipment}
        />
        <TextInput
          style={timeInputStyle}
          placeholder="Time"
          onChangeText={(value) => handleInput("time", value)}
          value={state.time}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="More Info"
          onChangeText={(value) => handleInput("moreInfo", value)}
          value={state.moreInfo}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={() => submitForm()} title="Save Exercise" />
        </View>
      </View>
      <ImagePicker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  input: {
    height: 40,
    marginTop: 5,
  },

  error: {
    borderColor: "red",
    borderWidth: 1,
  },

  buttonContainer: {
    marginTop: 5,
  },
});

export default EditExercise;
