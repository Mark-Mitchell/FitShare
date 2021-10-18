import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from "react-native";

import ExerciseComponent from "../main/Exercises/ExerciseComponent";
import Timer from "../PlayExercise/Timer";

function Break(props) {
  const [timerPlaying, setTimerPlaying] = useState(true);

  // When key is changed, the timer resets
  const [timerKey, setTimerKey] = useState(0);

  const { breakType, time, comingExercise } = props;

  const onComplete = () => {
    props.handleNextExercise();
  };

  return (
    <ScrollView style={{ flexDirection: "column" }}>
      <View
        style={{
          alignSelf: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          Break
        </Text>

        <Image source={require("../../images/break.jpg")} style={styles.img} />

        <View style={{ flexDirection: "row", alignContent: "space-between" }}>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                fontSize: 12,
                fontStyle: "italic",
                // alignSelf: "flex-start",
              }}
            >
              Sets: {props.currentSetInfo}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 12,
                fontStyle: "italic",
              }}
            >
              Exercise: {props.currentExerciseInfo}
            </Text>
          </View>
        </View>

        <Timer
          playing={timerPlaying}
          duration={props.time}
          key={timerKey}
          onComplete={onComplete}
        />

        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
            alignContent: "space-between",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name={timerPlaying ? "pause" : "play-outline"}
            size={50}
            onPress={() => setTimerPlaying(!timerPlaying)}
          />
          <MaterialCommunityIcons
            name="skip-forward"
            onPress={onComplete}
            size={50}
          />
        </View>

        {props.comingExercise && (
          <ExerciseComponent
            index={comingExercise}
            id={comingExercise}
            hideControls={true}
          />
        )}

        <Text
          style={{
            fontSize: 12,
            fontStyle: "italic",
            textAlign: "center",
            marginVertical: 20,
          }}
        >
          You deserve a break!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  img: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
    // height: "auto",
    borderRadius: 10,
  },
});
export default Break;
