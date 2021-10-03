import React, { useState, useEffect } from "react";
import { ScrollView, SafeAreaView, Button } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { fetchSelectedExercises } from "../../../redux/actions";

import GlobalStyles from "../../../assets/styling/GlobalStyles";
import ExerciseComponent from "./ExerciseComponent";

function Exercises(props) {
  const dispatch = useDispatch();

  // Fetch Local Exercises
  const [exercises, setExercises] = useState({});
  const globalExercises = useSelector((state) => state.exercises);
  useEffect(() => {
    setExercises(globalExercises);
  }, [globalExercises]);

  // used for ExercisePicker, longpress will select the exercise(s) and highlight the selected ones and update redux with their ids
  const [selectedExercises, setSelectedExercises] = useState([]);
  const exerciseSelectable =
    props.exerciseSelectable === undefined ? false : props.exerciseSelectable;

  const selectExercise = (id) => {
    let updatedSelectedExerciseIds = [...selectedExercises];
    if (updatedSelectedExerciseIds.includes(id)) {
      const index = updatedSelectedExerciseIds.indexOf(id);
      updatedSelectedExerciseIds.splice(index, 1);
    } else {
      updatedSelectedExerciseIds.push(id);
    }
    setSelectedExercises(updatedSelectedExerciseIds);
  };

  const saveSelectedExercises = () => {
    dispatch(fetchSelectedExercises(selectedExercises));
    props.navigation.goBack(null);
  };

  const exerciseComponents = Object.keys(exercises).map((exerciseId) => {
    // Only list items that are not empty (=deleted)
    if (exercises[exerciseId].name) {
      const selectedPicker = selectedExercises.includes(parseInt(exerciseId));
      return (
        <ExerciseComponent
          key={exerciseId}
          id={exerciseId}
          exercise={exercises[exerciseId]}
          navigation={props.navigation}
          exerciseSelectable={exerciseSelectable}
          selectExercise={selectExercise}
          selectedPicker={selectedPicker}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <SafeAreaView style={GlobalStyles.screenContainer}>
      <ScrollView>{exerciseComponents}</ScrollView>
      {exerciseSelectable && (
        <Button title="Save" onPress={() => saveSelectedExercises()} />
      )}
    </SafeAreaView>
  );
}

export default Exercises;
