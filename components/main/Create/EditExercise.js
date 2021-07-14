// Warning on Web, broken with new version of react native web, but works
import React, { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector, useDispatch } from "react-redux";
import { fetchLocalData } from "../../../redux/actions";

import ImagePicker from "./ImagePicker";
import * as FileSystem from "expo-file-system";

import DropSets from "./DropSets";
import TimePicker from "./TimePicker";

function EditExercise(props) {
  const initialState = {
    id: 0,
    name: "",
    description: "",
    equipment: "",
    time: -1,
    reps: -1,
    image: "",
    moreInfo: "",
    image: "",
    dropSets: false,
    dropSetInfo: {},
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

  // Handle Submit
  const localExercises = useSelector((state) => state.exercises);
  const dispatch = useDispatch();
  const submitForm = async () => {
    try {
      const id = generateId(localExercises);

      // Save Image locally
      if (Platform.OS !== "web" && state.image) {
        try {
          await FileSystem.copyAsync({
            from: state.image,
            to: FileSystem.documentDirectory + "images/" + id,
          });
        } catch (error) {
          console.log(error);
        }
      }

      const image =
        Platform.OS !== "web" && state.image
          ? FileSystem.documentDirectory + "images/" + id
          : "";

      // Add to Local Storage
      const newExercise = {
        [id]: {
          ...state,
          id,
          image,
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

  const generateId = (object) => {
    const idArray = Object.keys(object);
    return idArray.length > 0 ? Math.max(...idArray) + 1 : 1;
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
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

          <Button
            style={styles.halfButton}
            onPress={() => handleInput("time", state.time == -1 ? "" : -1)}
            title="Time"
          />
          <Button
            style={styles.halfButton}
            onPress={() => handleInput("reps", state.reps == -1 ? "" : -1)}
            title="Reps"
          />

          {state.time !== -1 && <TimePicker handleInput={handleInput} />}

          {state.reps !== -1 && (
            <TextInput
              style={timeInputStyle}
              placeholder="Repetitions"
              onChangeText={(value) => handleInput("reps", value)}
              value={state.reps}
              keyboardType="numeric"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="More Info"
            onChangeText={(value) => handleInput("moreInfo", value)}
            value={state.moreInfo}
          />
        </View>
        {Platform.OS !== "web" && (
          <ImagePicker
            setImage={(val) => handleInput("image", val)}
            imgURI={state.image}
          />
        )}

        <Button
          style={styles.halfButton}
          onPress={() => handleInput("dropSets", !state.dropSets)}
          title="Drop Sets"
        />
        <DropSets
          state={state}
          setState={setState}
          generateId={generateId}
          styles={styles}
        />

        <View style={styles.buttonContainer}>
          <Button onPress={() => submitForm()} title="Save Exercise" />
        </View>
      </View>
    </ScrollView>
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

  halfButton: {
    flex: 0.5,
  },
});

export default EditExercise;
