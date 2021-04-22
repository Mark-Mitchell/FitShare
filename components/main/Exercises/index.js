import React, { useState, useEffect } from "react";
import { Text, ScrollView, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

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
        name={exercises[exerciseId].name}
        description={exercises[exerciseId].description}
        equipment={exercises[exerciseId].equipment}
        time={exercises[exerciseId].time}
      />
    );
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Text>Tennis</Text>
        {exerciseComponents}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Exercises;
