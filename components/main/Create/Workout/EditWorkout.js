import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import WorkoutPage from "../../Workouts/WorkoutPage";
import Form from "./Form";

import ReordableList from "./ReordableList";

function EditWorkout(props) {
  const exercises = useSelector((state) => state.exercises);
  const [step, setStep] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [workout, setWorkout] = useState({
    generalInfo: {
      title: "",
      description: "",
      defaultTimeBetweenSets: 10,
      defaultTimeBetweenExercises: 30,
      defaultReps: 1,
    },
    exercises: {},
  });

  // Generate the workout in the background after every change
  useEffect(() => {
    setWorkout((prevState) => {
      let newExerciseState = {};
      for (let i = 0; i < selectedExercises.length; i++) {
        const timeBetweenExercises = prevState.exercises.hasOwnProperty(i)
          ? prevState.exercises[parseInt(i)].timeBetweenExercises
            ? prevState.exercises[parseInt(i)].timeBetweenExercises
            : null
          : null;
        const timeBetweenSets = prevState.exercises.hasOwnProperty(i)
          ? prevState.exercises[parseInt(i)].timeBetweenSets
            ? prevState.exercises[parseInt(i)].timeBetweenSets
            : null
          : null;

        const reps = prevState.exercises.hasOwnProperty(i)
          ? prevState.exercises[parseInt(i)].reps
            ? prevState.exercises[parseInt(i)].reps
            : null
          : null;

        if (exercises[selectedExercises[i]].name) {
          newExerciseState = {
            ...newExerciseState,
            [i]: {
              info: exercises[selectedExercises[i]],
              position: i + 1,
              timeBetweenExercises,
              timeBetweenSets,
              reps,
            },
          };
        }
      }

      return {
        ...prevState,
        exercises: newExerciseState,
      };
    });
  }, [selectedExercises]);

  return (
    <View style={styles.container}>
      {/* Step One (Chosing the exercises and their order) */}
      {step === 1 && (
        <>
          <Button
            title="Add Exercise"
            onPress={() => props.navigation.navigate("ExercisePicker")}
          />
          <ReordableList
            navigation={props.navigation}
            setSelectedExercises={setSelectedExercises}
            selectedExercises={selectedExercises}
          />
        </>
      )}

      {/* Step Two (General Info & Default rest times) */}
      {step === 2 && (
        <>
          <Form setWorkout={setWorkout} workout={workout} />
        </>
      )}

      {/* Step Three (Modify default rest times and save) */}
      {step === 3 && (
        <>
          <WorkoutPage
            selectedExercises={selectedExercises}
            navigation={props.navigation}
            workout={workout}
            setWorkout={setWorkout}
          />
        </>
      )}

      {/* Step Controls (always shown on the bottom) */}
      <View style={styles.stepControl}>
        <Button title="Step 1" onPress={() => setStep(1)} />
        <Button title="Step 2" onPress={() => setStep(2)} />
        <Button title="Step 3" onPress={() => setStep(3)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepControl: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default EditWorkout;
