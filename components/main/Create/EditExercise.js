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
import { fetchEquipmentPicker, fetchLocalData } from "../../../redux/actions";

import ImagePicker from "./ImagePicker";
import * as FileSystem from "expo-file-system";

import DropSets from "./DropSets";
import PickerComponent from "./PickerComponent";

import { defaultEquipment } from "../../../assets/exercise data/equipment";

function EditExercise(props) {
  const initialState = {
    id: 0,
    name: "",
    description: "",
    equipment: {},
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
    if (isNaN(state.time)) {
      const errorInputStyle = StyleSheet.flatten([styles.input, styles.error]);
      setTimeInputStyle(errorInputStyle);
    } else {
      setTimeInputStyle(styles.input);
    }
  }, [state]);

  // update state when equipment is updated from the EquipmentPicker using redux
  const equipment = useSelector((state) => state.equipmentPicker);
  useEffect(() => {
    setState({
      ...state,
      equipment,
    });
  }, [equipment]);

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
      // reset equipmentPicker in redux
      dispatch(fetchEquipmentPicker(defaultEquipment));
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
            multiline={true}
          />

          <Button
            onPress={() =>
              props.navigation.navigate("EquipmentPicker", { state })
            }
            title="Equipment Picker"
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

          {state.time !== -1 && (
            <PickerComponent handleInput={handleInput} type="time" />
          )}

          {state.reps !== -1 && (
            <PickerComponent
              type="reps"
              reps={state.reps}
              handleInput={handleInput}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="More Info"
            onChangeText={(value) => handleInput("moreInfo", value)}
            value={state.moreInfo}
            multiline={true}
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
