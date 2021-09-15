import React from "react";
import { Alert, Platform, Pressable } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

import { useDispatch, useSelector } from "react-redux";
import { fetchLocalData } from "../../../redux/actions";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

function DeleteExercise(props) {
  // Delete Exercise (Exercises) or remove Exercise from Workout (EditWorkout)
  const workout = props.workout ? true : false;

  const globalExercises = useSelector((state) => state.exercises);
  const dispatch = useDispatch();

  const handleDeleteExercise = () => {
    if (workout) {
      // remove exercise from workout list
      props.removeItemFromList(props.currentIndex);
    } else {
      // delete the exercise completely
      // Platform specific conformation prompt
      if (Platform.OS === "web") {
        return confirm("Test") ? deleteExercise() : null;
      } else {
        return Alert.alert(
          globalExercises[props.id].name,
          "Are you sure you want to delete this exercise?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "Delete", onPress: () => deleteExercise() },
          ]
        );
      }
    }
  };

  const deleteExercise = async () => {
    const updatedExercises = {
      ...globalExercises,
      [props.id]: {},
    };

    // Delete image if one was provided
    if (globalExercises[props.id].image && Platform.OS !== "web") {
      await FileSystem.deleteAsync(globalExercises[props.id].image, {
        idempotent: true,
      });
    }
    // Delete from Local Storage
    await AsyncStorage.setItem("exercises", JSON.stringify(updatedExercises));
    // Remove from Redux Store
    dispatch(fetchLocalData(updatedExercises));

    // Todo: add success message
  };

  return (
    <Pressable>
      <MaterialCommunityIcons
        name="close"
        color="black"
        size={20}
        onPress={handleDeleteExercise}
      />
    </Pressable>
  );
}

export default DeleteExercise;
