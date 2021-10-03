import React, { useEffect, useState } from "react";
import { Text, Button } from "react-native";

import { useSelector } from "react-redux";

import ExerciseComponent from "../Exercises/ExerciseComponent";
import TimeRepsPicker from "../Create/Workout/TimeRepsPicker";

function WorkoutPage(props) {
  const exercises = useSelector((state) => state.exercises);

  const [workout, setWorkout] = useState(props.workout);
  const [exercisesComponent, setExercisesComponent] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [pickerInfo, setPickerInfo] = useState({
    time: null,
    index: null,
    type: undefined,
    repsPicker: false,
    editingSingleExercise: true,
  });

  const handleTimePress = (type, index, time) => {
    setPickerInfo((prevState) => {
      return {
        ...prevState,
        time,
        index,
        type,
        repsPicker: false,
      };
    });
    setModalVisible(true);
  };

  const handleRepsPress = (index, reps) => {
    setPickerInfo((prevState) => {
      return {
        ...prevState,
        index,
        repsPicker: true,
      };
    });
    setModalVisible(true);
  };

  const handleTimeChange = (type, index, newTime) => {
    props.setWorkout((prevState) => {
      return {
        ...prevState,
        exercises: {
          ...prevState.exercises,
          [index]: {
            ...prevState.exercises[index],
            timeBetweenSets:
              type === "between_sets"
                ? newTime
                : prevState.exercises[index].timeBetweenSets,
            timeBetweenExercises:
              type === "after_exercise"
                ? newTime
                : prevState.exercises[index].timeBetweenExercises,
          },
        },
      };
    });
  };

  const handleRepsChange = (index, newReps) => {
    console.log("handleRepsChange");
    props.setWorkout((prevState) => {
      return {
        ...prevState,
        exercises: {
          ...prevState.exercises,
          [index]: {
            ...prevState.exercises[index],
            reps: newReps,
          },
        },
      };
    });
  };

  const setExercises = () => {
    const { selectedExercises } = props;
    let components = [];
    for (let i = 0; i < selectedExercises.length; i++) {
      if (exercises[selectedExercises[i]].name) {
        const {
          defaultTimeBetweenExercises,
          defaultTimeBetweenSets,
          defaultReps,
        } = workout.generalInfo;

        const timeBetweenSets = workout.exercises.hasOwnProperty(i)
          ? workout.exercises[i].timeBetweenSets ||
            workout.exercises[i].timeBetweenSets === 0
            ? workout.exercises[i].timeBetweenSets
            : defaultTimeBetweenSets
          : defaultTimeBetweenSets;
        const timeBetweenExercises = workout.exercises.hasOwnProperty(i)
          ? workout.exercises[i].timeBetweenExercises ||
            workout.exercises[i].timeBetweenExercises === 0
            ? workout.exercises[i].timeBetweenExercises
            : defaultTimeBetweenExercises
          : defaultTimeBetweenExercises;

        const reps = workout.exercises.hasOwnProperty(i)
          ? workout.exercises[i].reps || workout.exercises[i].reps === 0
            ? workout.exercises[i].reps
            : defaultReps
          : defaultReps;

        components.push(
          <ExerciseComponent
            key={i}
            index={i}
            id={selectedExercises[i]}
            exercise={exercises[selectedExercises[i]]}
            navigation={props.navigation}
            workout={true}
            timeBetweenSets={timeBetweenSets}
            timeAfterExercise={timeBetweenExercises}
            reps={reps}
            handleTimePress={handleTimePress}
            handleRepsPress={handleRepsPress}
          />
        );
      }
    }
    setExercisesComponent(components);
  };

  useEffect(() => {
    setExercises();
  }, []);

  useEffect(() => {
    setWorkout(props.workout);
  }, [props.workout]);

  useEffect(() => {
    setExercises();
  }, [workout]);

  return (
    <>
      <TimeRepsPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        info={pickerInfo}
        handleTimeChange={handleTimeChange}
        handleRepsChange={handleRepsChange}
      />

      <Text>Workout Page</Text>
      <Text>{props.workout.generalInfo.title}</Text>
      <Text>{props.workout.generalInfo.description}</Text>

      {exercisesComponent}
      {/* WIP, doesn't save yet */}
      <Button
        title="Save Workout"
        onPress={() => console.log("SAVE WORKOUT")}
      />
    </>
  );
}

export default WorkoutPage;
