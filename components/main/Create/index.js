import React, { useState } from "react";
import { StyleSheet, Switch, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditExercise from "./Exercise/EditExercise";
import EditWorkout from "./Workout/EditWorkout";

function Create(props) {
  const [editExercise, setEditExercise] = useState(true);
  return (
    <SafeAreaView>
      <View style={styles.switch}>
        <Text>Create Exercise</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={!editExercise ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setEditExercise((prevState) => !prevState)}
          value={!editExercise}
          style={{ marginLeft: 10, marginRight: 10 }}
        />
        <Text>Create Workout</Text>
      </View>

      {editExercise ? (
        <EditExercise navigation={props.navigation} />
      ) : (
        <EditWorkout navigation={props.navigation} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  switch: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default Create;
