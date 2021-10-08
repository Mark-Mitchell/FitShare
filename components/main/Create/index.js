import React, { useState } from "react";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditExercise from "./Exercise/EditExercise";
import EditWorkout from "./Workout/EditWorkout";

function Create(props) {
  const [editExercise, setEditExercise] = useState(true);
  return (
    <SafeAreaView>
      <Button
        title="Toggle Exercise / Workout"
        onPress={() => setEditExercise(!editExercise)}
      />
      {editExercise ? (
        <EditExercise navigation={props.navigation} />
      ) : (
        <EditWorkout navigation={props.navigation} />
      )}
    </SafeAreaView>
  );
}

export default Create;
