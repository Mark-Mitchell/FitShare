import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Dimensions, ScrollView } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchLocalWorkouts } from "../../../../redux/actions";

import AsyncStorage from "@react-native-async-storage/async-storage";

import WorkoutPage from "../../Workouts/WorkoutPage";
import Form from "./Form";
import ReordableList from "./ReordableList";

import generateId from "../../../../assets/global functions/generateId";

function EditWorkout(props) {
  const isEditing = props.hasOwnProperty("route");

  const exercises = useSelector((state) => state.exercises);

  const initialWorkoutState = isEditing
    ? props.route.params.workout
    : {
        generalInfo: {
          title: "",
          description: "",
          defaultTimeBetweenSets: 10,
          defaultTimeBetweenExercises: 30,
          defaultReps: 1,
        },
        exercises: {},
      };

  const initialSelectedExercises = isEditing
    ? Object.keys(props.route.params.workout.exercises).map(
        (index) => props.route.params.workout.exercises[parseInt(index)].info.id
      )
    : [];

  const [step, setStep] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState(
    initialSelectedExercises
  );
  const [workout, setWorkout] = useState(initialWorkoutState);

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
              // info: exercises[selectedExercises[i]],
              info: {
                id: exercises[selectedExercises[i]].id,
              },
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

  // Save the Workout
  const dispatch = useDispatch();
  const reduxWorkouts = useSelector((state) => state.workouts);

  const saveWorkout = async () => {
    // save to redux
    const id = isEditing
      ? props.route.params.workout.generalInfo.id
      : generateId(reduxWorkouts);

    const newState = {
      ...reduxWorkouts,
      [id]: {
        ...workout,
        generalInfo: {
          ...workout.generalInfo,
          id,
        },
      },
    };

    dispatch(fetchLocalWorkouts(newState));

    // save to LocalStorage
    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(newState));
    } catch (error) {
      console.log(error);
    }

    // reset form
    setWorkout(initialWorkoutState);
    setStep(1);
    setSelectedExercises([]);

    // return to start
    isEditing
      ? props.navigation.popToTop()
      : props.navigation.navigate("Workouts");
  };

  return (
    <ScrollView>
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
            <Button title="Save Workout" onPress={() => saveWorkout()} />
          </>
        )}
        {/* Step Controls (always shown on the bottom) */}
        <View style={styles.stepControl}>
          <Button title="Step 1" onPress={() => setStep(1)} />
          <Button title="Step 2" onPress={() => setStep(2)} />
          <Button title="Step 3" onPress={() => setStep(3)} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: Dimensions.get("window").height - 100,
  },
  stepControl: {
    flex: 1,
    flexDirection: "column",
    // alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
});

export default EditWorkout;
