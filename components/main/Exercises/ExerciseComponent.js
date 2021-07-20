import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { equipmentIcons } from "../../../assets/exercise data/equipment";

import DeleteExercise from "./DeleteExercise";

function ExerciseComponent(props) {
  // get default image when on web or none was provided
  const imageUri =
    props.image && Platform.OS !== "web"
      ? { uri: props.image }
      : require("../../../images/WIP.jpg");

  // filter the equipment that is needed and display its icon
  const equipment = Object.keys(props.exercise.equipment).filter(
    (equipmentItem) => props.exercise.equipment[equipmentItem] && equipmentItem
  );
  const equipmentComponents = equipment.map((equipmentItem) => (
    <MaterialCommunityIcons
      key={equipmentItem}
      name={equipmentIcons[equipmentItem]}
      color={"black"}
      size={10}
    />
  ));

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={imageUri} style={styles.img} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{props.exercise.name}</Text>
        <Text style={styles.description}>{props.exercise.description}</Text>

        <Text>Equipment Required:</Text>
        <View style={styles.equipmentContainer}>{equipmentComponents}</View>

        {props.exercise.time !== -1 && <Text>Time: {props.exercise.time}</Text>}
        {props.exercise.reps !== -1 && <Text>Reps: {props.exercise.reps}</Text>}

        <Text>{props.exercise.moreInfo}</Text>
        <Text>Drop Sets: {props.exercise.dropSets ? "Yes" : "No"}</Text>
      </View>

      {/* Play / Delete Buttons */}
      <View>
        <MaterialCommunityIcons
          name="play-outline"
          size={50}
          onPress={() =>
            props.navigation.navigate("PlayExercise", {
              exercise: props.exercise,
            })
          }
        />
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

  title: {
    fontWeight: "bold",
  },

  description: {
    fontStyle: "italic",
  },

  equipmentContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
  },

  imgContainer: {
    flexDirection: "row",
    flex: 3,
    marginRight: 10,
  },

  contentContainer: {
    flex: 6,
  },

  img: {
    width: "100%",
    height: "100%",
  },

  deleteButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default ExerciseComponent;
