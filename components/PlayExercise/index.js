import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function PlayExercise(props) {
  const { exercise } = props.route.params;

  const imageUri =
    exercise.image && Platform.OS !== "web"
      ? { uri: exercise.image }
      : require("../../images/WIP.jpg");

  console.log(exercise);
  return (
    <View>
      <Text>{exercise.name}</Text>
      <Text>{exercise.description}</Text>
      <Text>{exercise.equipment}</Text>
      <Text>{exercise.moreInfo}</Text>
      <Text>{exercise.reps}</Text>
      <Text>{exercise.time}</Text>

      <View style={styles.imgContainer}>
        <Image source={imageUri} style={styles.img} />
      </View>

      <MaterialCommunityIcons
        name="stop"
        size={50}
        onPress={() => console.log("click")}
      />
      <MaterialCommunityIcons
        name="play-outline"
        size={50}
        onPress={() => console.log("click")}
      />
      <MaterialCommunityIcons
        name="pause"
        size={50}
        onPress={() => console.log("click")}
      />
      <MaterialCommunityIcons
        name="check"
        size={50}
        onPress={() => console.log("click")}
      />
    </View>
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
