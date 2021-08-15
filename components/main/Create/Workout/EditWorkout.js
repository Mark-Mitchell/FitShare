import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import { useSelector } from "react-redux";

import DraggableList from "./DraggableList";

function EditWorkout(props) {
  const [selectedExercises, setSelectedExercises] = useState([]);

  const selectedExercisesRedux = useSelector(
    (state) => state.selectedExercises
  );
  useEffect(() => {
    setSelectedExercises(selectedExercisesRedux);
  }, [selectedExercisesRedux]);

  return (
    <View>
      {/* <Text>Edit Workout</Text>
      <Button
        title="Add Exercise"
        onPress={() => props.navigation.navigate("ExercisePicker")}
      /> */}
      <DraggableList
        selectedExercises={selectedExercises}
        navigation={props.navigation}
      />
    </View>
  );
}

export default EditWorkout;
