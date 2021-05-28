import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import DeleteExercise from "./DeleteExercise";

function ExerciseComponent(props) {
  const imageUri =
    props.image && Platform.OS !== "web"
      ? { uri: props.image }
      : require("../../../images/WIP.jpg");

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={imageUri} style={styles.img} />
      </View>
      <View style={styles.contentContainer}>
        <Text>{props.name}</Text>
        <Text>{props.description}</Text>
        <Text>{props.equipment}</Text>
        <Text>{props.time}</Text>
      </View>
      <View style={styles.deleteButtonContainer}>
        <DeleteExercise id={props.id} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: 100,
    backgroundColor: "#fff",
    padding: 5,
    margin: 5,
  },

  imgContainer: {
    flexDirection: "row",
    flex: 1 / 5,
    marginRight: 10,
  },

  contentContainer: {
    flex: 3 / 5,
  },

  img: {
    width: "100%",
    height: "100%",
  },

  deleteButtonContainer: {
    flex: 1 / 5,
  },
});

export default ExerciseComponent;
