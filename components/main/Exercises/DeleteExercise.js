import React, { useState, useEffect } from "react";
import { Platform, Pressable, Text, TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

import { useDispatch, useSelector } from "react-redux";
import { fetchLocalData } from "../../../redux/actions";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DeleteConformation from "../../../assets/global functions/DeleteConformation";
import GlobalStyles from "../../../assets/styling/GlobalStyles";

function DeleteExercise(props) {
  // Delete Exercise (Exercises) or remove Exercise from Workout (EditWorkout)
  const workout = props.workout ? true : false;

  // Confirmation Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(false);

  const globalExercises = useSelector((state) => state.exercises);
  const dispatch = useDispatch();

  const handleDeleteExercise = () => {
    if (workout) {
      // remove exercise from workout list
      props.removeItemFromList(props.currentIndex);
    } else {
      setModalVisible(true);
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
  };

  useEffect(() => {
    toBeDeleted && deleteExercise();
  }, [toBeDeleted]);

  return (
    <>
      <DeleteConformation
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        changeOnConfirm={setToBeDeleted}
        title="Delete Exercise?"
        body="Do you really want to delete this Exercise?"
      />
      {/* <Pressable>
        <MaterialCommunityIcons
          name="close"
          color="black"
          size={20}
          onPress={handleDeleteExercise}
        />
      </Pressable> */}
      <TouchableOpacity
        style={GlobalStyles.optionButton}
        onPress={handleDeleteExercise}
      >
        <MaterialCommunityIcons name="delete" size={18} />
        <Text style={GlobalStyles.optionButtonText}>Delete</Text>
      </TouchableOpacity>
    </>
  );
}

export default DeleteExercise;
