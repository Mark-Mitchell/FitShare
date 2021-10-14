import React, { useEffect, useState } from "react";
import { ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector } from "react-redux";
import checkNetworkConnection from "../../../assets/global functions/checkNetworkConnection";

import WorkoutComponent from "./WorkoutComponent";

function Workout(props) {
  const [workoutComponents, setWorkoutComponents] = useState(null);
  const [isConnected, setIsConnected] = useState(null);

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

  const checkInternet = async () => {
    const internetReachable = await checkNetworkConnection();
    setIsConnected(internetReachable);
  };

  useEffect(() => {
    checkInternet();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {workoutComponents}
        <Button
          title={
            isConnected
              ? "Download Online Workout"
              : "Please connect to the internet to seach for an online workout"
          }
          onPress={() =>
            isConnected
              ? props.navigation.navigate("DownloadUnlistedWorkout")
              : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Workout;
