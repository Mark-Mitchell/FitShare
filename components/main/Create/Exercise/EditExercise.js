// Warning on Web, broken with new version of react native web, but works
import React, { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  Platform,
  ScrollView,
  Switch,
  Text,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchEquipmentPicker,
  fetchLocalData,
} from "../../../../redux/actions";

import ImagePicker from "./ImagePicker";
import * as FileSystem from "expo-file-system";

import DropSets from "./DropSets";
import PickerComponent from "./PickerComponent";

import { defaultEquipment } from "../../../../assets/exercise data/equipment";
import generateId from "../../../../assets/global functions/generateId";

function EditExercise(props) {
  const localExercises = useSelector((state) => state.exercises);

  const isEditing = props.hasOwnProperty("route");

  const initialState = isEditing
    ? localExercises[props.route.params.id]
    : {
        id: 0,
        name: "",
        description: "",
        equipment: {},
        time: -1,
        reps: 1,
        image: "",
        moreInfo: "",
        image: "",
        dropSets: false,
        dropSetInfo: {},
      };
  const [state, setState] = useState(initialState);

  // Timed exercise or Reps based
  const [isTimedExercise, setIsTimeExercise] = useState(
    isEditing ? state.time !== -1 : false
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading === true) return setLoading(false);
    setState((prevState) => {
      return {
        ...prevState,
        time: isTimedExercise ? 0 : -1,
        reps: isTimedExercise ? -1 : 1,
      };
    });
  }, [isTimedExercise]);

  const handleInput = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  // update state when equipment is updated from the EquipmentPicker using redux
  const equipment = useSelector((state) => state.equipmentPicker);
  useEffect(() => {
    setState({
      ...state,
      equipment,
    });
  }, [equipment]);

  // Handle Submit
  const dispatch = useDispatch();

  const submitForm = async () => {
    try {
      const id = isEditing ? state.id : generateId(localExercises);

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
      isEditing
        ? props.navigation.goBack()
        : props.navigation.navigate("Exercises");
      // reset equipmentPicker in redux
      dispatch(fetchEquipmentPicker(defaultEquipment));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
    // contentContainerStyle={{ flexGrow: 1 }}
    // keyboardShouldPersistTaps="handled"
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

          <View style={styles.isTimedExerciseContainer}>
            <Text>Reps </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isTimedExercise ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsTimeExercise((prevState) => !prevState)}
              value={isTimedExercise}
            />
            <Text> Time</Text>
          </View>

          {state.time !== -1 && (
            <PickerComponent
              handleInput={handleInput}
              type="time"
              startTime={isEditing ? state.time : null}
            />
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

  isTimedExerciseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default EditExercise;
