import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Timer from "./Timer";

function PlayExercise(props) {
  const { exercise } = props.route.params;

  const [timerPlaying, setTimerPlaying] = useState(false);
  const [timerDuration, setTimerDurataion] = useState(exercise.time);
  // When key is changed, the timer resets
  const [timerKey, setTimerKey] = useState(0);

  const imageUri =
    exercise.image && Platform.OS !== "web"
      ? { uri: exercise.image }
      : require("../../images/WIP.jpg");

  return (
    <ScrollView>
      {exercise.time > 0 && (
        <Timer playing={timerPlaying} duration={timerDuration} key={timerKey} />
      )}

      {/* <Text>{exercise.name}</Text>
      <Text>{exercise.description}</Text>
      <Text>{exercise.equipment}</Text>
      <Text>{exercise.moreInfo}</Text>
      <Text>{exercise.reps}</Text>
      <Text>{exercise.time}</Text>

      <View style={styles.imgContainer}>
        <Image source={imageUri} style={styles.img} />
      </View> */}

      <MaterialCommunityIcons
        name="reload"
        size={50}
        onPress={() => setTimerKey(timerKey + 1)}
      />
      <MaterialCommunityIcons
        name={timerPlaying ? "pause" : "play-outline"}
        size={50}
        onPress={() => setTimerPlaying(!timerPlaying)}
      />
      <MaterialCommunityIcons
        name="check"
        size={50}
        onPress={() => console.log("click")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    flexDirection: "row",
    flex: 1 / 5,
    marginRight: 10,
  },

  img: {
    width: 300,
    height: 300,
  },
});

export default PlayExercise;
