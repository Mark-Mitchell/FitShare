import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector } from "react-redux";

import WorkoutComponent from "./WorkoutComponent";

function Workout(props) {
  const [workoutComponents, setWorkoutComponents] = useState(null);

  const reduxWorkouts = useSelector((state) => state.workouts);

  const fetchReduxWorkouts = () => {
    const workoutComponents = Object.keys(reduxWorkouts).map((id) => {
      !reduxWorkouts[id].hasOwnProperty("generalInfo") && null;
      return (
        <WorkoutComponent
          key={id}
          navigation={props.navigation}
          id={id}
          workout={reduxWorkouts[id]}
        />
      );
    });
    setWorkoutComponents(workoutComponents);
  };

  useEffect(() => {
    fetchReduxWorkouts();
  }, [reduxWorkouts]);

  return (
    <SafeAreaView>
      <ScrollView>{workoutComponents}</ScrollView>
    </SafeAreaView>
  );
}

export default Workout;
