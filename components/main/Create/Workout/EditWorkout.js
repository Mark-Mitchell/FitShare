import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchLocalWorkouts } from "../../../../redux/actions";

import AsyncStorage from "@react-native-async-storage/async-storage";

import WorkoutPage from "../../Workouts/WorkoutPage";
import Form from "./Form";
import ReordableList from "./ReordableList";

import generateId from "../../../../assets/global functions/generateId";

function EditWorkout(props) {
  const exercises = useSelector((state) => state.exercises);
  const [step, setStep] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const initialWorkoutState = {
    generalInfo: {
      title: "",
      description: "",
      defaultTimeBetweenSets: 10,
      defaultTimeBetweenExercises: 30,
      defaultReps: 1,
    },
    exercises: {},
  };
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

  // Save the Workout
  const dispatch = useDispatch();
  const reduxWorkouts = useSelector((state) => state.workouts);

  const calculateWorkoutTime = (exercisesObject) => {
    let totalTime = 0;
    for (let i = 0; i < Object.keys(exercisesObject).length; i++) {
      const id = exercisesObject[i].info.id;
      const exercise = exercises[id];
      const isTimedExercise = exercise.time !== -1;

      const workoutReps = workout.exercises[i].reps
        ? workout.exercises[i].reps
        : 1;
      const timeBetweenSets =
        workout.exercises[i].timeBetweenSets ||
        workout.exercises[i].timeBetweenSets === 0
          ? workout.exercises[i].timeBetweenSets
          : workout.generalInfo.defaultTimeBetweenSets;
      const timeBetweenExercises =
        workout.exercises[i].timeBetweenExercises ||
        workout.exercises[i].timeBetweenExercises === 0
          ? workout.exercises[i].timeBetweenExercises
          : workout.generalInfo.defaultTimeBetweenExercises;

      // exercise time
      if (isTimedExercise) {
        totalTime += workoutReps * exercise.time;
      } else {
        totalTime += workoutReps * exercise.reps * 5;
      }
      // break time
      totalTime += (workoutReps - 1) * timeBetweenSets;
      totalTime += timeBetweenExercises;
    }
    return totalTime;
  };

  const saveWorkout = async () => {
    // calculate the estimated time per workout:
    const totalTime = calculateWorkoutTime(workout.exercises);

    // save to redux
    const id = generateId(reduxWorkouts);

    const newState = {
      ...reduxWorkouts,
      [id]: {
        ...workout,
        generalInfo: {
          ...workout.generalInfo,
          totalTime,
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
  };

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
