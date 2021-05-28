import React from "react";
import { View, Button, Alert, Platform } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchLocalData } from "../../../redux/actions";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

function DeleteExercise(props) {
  const globalExercises = useSelector((state) => state.exercises);
  const dispatch = useDispatch();

  const handleDeleteExercise = () => {
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
          { text: "OK", onPress: () => deleteExercise() },
        ]
      );
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
    <View>
      <Button title="Delete Exercise" onPress={handleDeleteExercise} />
    </View>
  );
}

export default DeleteExercise;
