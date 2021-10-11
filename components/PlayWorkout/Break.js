import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";

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
    <>
      <Timer
        playing={timerPlaying}
        duration={props.time}
        key={timerKey}
        onComplete={onComplete}
      />
      {props.comingExercise && (
        <ExerciseComponent
          index={comingExercise}
          id={comingExercise}
          hideControls={true}
        />
      )}
      <MaterialCommunityIcons
        name="skip-forward"
        onPress={onComplete}
        size={30}
      />
    </>
  );
}

export default Break;
