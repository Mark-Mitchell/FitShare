import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import generateId from "../../../assets/global functions/generateId";
import { getRandomWorkoutImg } from "../../../assets/global functions/getRandomWorkoutImg";

import formatTime from "../../../assets/styling/formatTime";
import { lightBackgroundColor } from "../../../assets/styling/GlobalColors";
import { fetchLocalWorkouts } from "../../../redux/actions";
import calculateWorkoutTime from "./calculateWorkoutTime";

function WorkoutComponent(props) {
  const exercises = useSelector((state) => state.exercises);
  const defaultExercises = useSelector((state) => state.defaultExercises);
  const reduxWorkouts = useSelector((state) => state.workouts);

  const image = getRandomWorkoutImg();

  const dispatch = useDispatch();

  const downloadOnlineWorkout = async () => {
    const id = generateId(reduxWorkouts);

    const newState = {
      ...reduxWorkouts,
      [id]: {
        ...props.workout,
        generalInfo: {
          ...props.workout.generalInfo,
          id: id,
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

    // return to start
    props.navigation.navigate("Workouts");
  };

  return (
    <>
      {props.workout.hasOwnProperty("generalInfo") && (
        <Pressable
          onPress={() =>
            props.navigation.navigate("WorkoutPage", {
              workout: props.workout,
              name: props.workout.generalInfo.title,
            })
          }
          style={styles.container}
        >
          <View style={styles.content}>
            <Image source={image} style={styles.image} />
            <View styles={styles.info}>
              <Text style={styles.title}>Name:</Text>
              <Text>
                {props.workout.generalInfo.title} ({props.id})
              </Text>
              <Text style={styles.title}>Description:</Text>
              <Text>
                {props.workout.generalInfo.description
                  ? props.workout.generalInfo.description
                  : "\n"}
              </Text>
              <Text style={styles.title}>Estimated Time:</Text>
              <Text>
                {formatTime(
                  calculateWorkoutTime(
                    props.workout,
                    exercises,
                    defaultExercises
                  )
                )}
              </Text>
              {!!(
                props.workout.hasOwnProperty("generalInfo") &&
                props.workout.generalInfo.hasOwnProperty("slug") &&
                props.workout.generalInfo.slug
              ) && (
                <>
                  <Text
                    style={{
                      fontSize: 12,
                      fontStyle: "italic",
                      flexWrap: "wrap",
                    }}
                  >
                    Online Workout (ID): {props.workout.generalInfo.slug} {"\n"}
                    Creator: {props.workout.generalInfo.creatorUsername}
                  </Text>
                </>
              )}
            </View>
          </View>
          {props.hasOwnProperty("onlineWorkout") && props.onlineWorkout && (
            <MaterialCommunityIcons
              name="download"
              size={30}
              onPress={() => downloadOnlineWorkout()}
            />
          )}
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "auto",
    width: "35%",
    borderRadius: 10,
    marginRight: 15,
  },
  content: {
    flexDirection: "row",
    paddingLeft: 10,
  },
  info: {
    paddingLeft: 20,
  },
  container: {
    padding: 10,
    backgroundColor: lightBackgroundColor,
    borderRadius: 10,
    margin: 10,
    marginBottom: 0,
  },
  title: {
    fontWeight: "bold",
  },
});

export default WorkoutComponent;
