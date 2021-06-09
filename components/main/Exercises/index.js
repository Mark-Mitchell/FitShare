import React, { useState, useEffect } from "react";
import { ScrollView, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

import GlobalStyles from "../../../assets/GlobalStyles";
import ExerciseComponent from "./ExerciseComponent";

function Exercises() {
  const [exercises, setExercises] = useState({});

  // Fetch Local Exercises on Mount
  const globalExercises = useSelector((state) => state.exercises);
  useEffect(() => {
    setExercises(globalExercises);
  }, [globalExercises]);

  const exerciseComponents = Object.keys(exercises).map((exerciseId) => {
    // Only list items that are not empty (=deleted)
    return !exercises[exerciseId].name ? null : (
      <ExerciseComponent
        key={exerciseId}
        id={exerciseId}
        exercise={exercises[exerciseId]}
      />
    );
  });

  return (
    <SafeAreaView style={GlobalStyles.screenContainer}>
      <ScrollView>{exerciseComponents}</ScrollView>
    </SafeAreaView>
  );
}

export default Exercises;
