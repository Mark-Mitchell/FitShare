import React, { useState } from "react";
import { SafeAreaView, Button } from "react-native";

import GlobalStyles from "../../../assets/GlobalStyles";
import EditExercise from "./Exercise/EditExercise";
import EditWorkout from "./Workout/EditWorkout";

function Create(props) {
  const [editExercise, setEditExercise] = useState(false);
  return (
    // <SafeAreaView style={GlobalStyles.screenContainer}>
    //   {/* <Button
    //     title="Toggle Exercise / Workout"
    //     onPress={() => setEditExercise(!editExercise)}
    //   /> */}
    //   {editExercise ? (
    //     <EditExercise navigation={props.navigation} />
    //   ) : (
    //     <EditWorkout navigation={props.navigation} />
    //   )}
    // </SafeAreaView>
    <EditWorkout navigation={props.navigation} />
  );
}

export default Create;
