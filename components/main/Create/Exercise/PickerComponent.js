// Can't use @react-native-picker/picker with expo managed build, so currently uses deprecated but working Picker from react-native
// import { Picker } from "@react-native-picker/picker";

import React, { useState } from "react";
import { View, Picker } from "react-native";

function TimePickerComponent(props) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Makes list of numbers for the dropdowns (displayPercentage, incrementBy needed for dropSetWeight)
  const pickerItems = (
    maxNumber,
    displayPercentage = false,
    incrementBy = 1,
    startingNum = 0
  ) => {
    let array = [];
    for (let i = startingNum; i < maxNumber + 1; i += incrementBy) {
      let label = i.toString();
      displayPercentage && (label += "%");
      array.push(<Picker.Item label={label} value={i} key={i} />);
    }
    return array;
  };

  // Set Time in state and update totalTime in parent component
  const handleTimeInput = (type, value) => {
    let totalTimeInSeconds;

    if (type === "minutes") {
      setMinutes(value);
      totalTimeInSeconds = parseInt(value) * 60 + parseInt(seconds);
    } else if (type === "seconds") {
      setSeconds(value);
      totalTimeInSeconds = parseInt(minutes) * 60 + parseInt(value);
    }

    props.handleInput("time", totalTimeInSeconds);
  };

  // Render two dropdowns for time and one for reps
  return (
    <View>
      {/* Time Input */}
      {props.type === "time" && (
        <View>
          <Picker
            mode={"dropdown"}
            selectedValue={minutes}
            onValueChange={(itemValue) => handleTimeInput("minutes", itemValue)}
          >
            {pickerItems(60)}
          </Picker>

          <Picker
            selectedValue={seconds}
            onValueChange={(itemValue) => handleTimeInput("seconds", itemValue)}
          >
            {pickerItems(59)}
          </Picker>
        </View>
      )}

      {/* Reps Input */}
      {props.type === "reps" && (
        <Picker
          mode={"dropdown"}
          selectedValue={props.reps}
          onValueChange={(itemValue) => props.handleInput("reps", itemValue)}
        >
          {pickerItems(100, false, 1, 1)}
        </Picker>
      )}

      {/* Dropsets */}
      {props.type === "dropsetReps" && (
        <Picker
          mode={"dropdown"}
          selectedValue={props.reps}
          onValueChange={(itemValue) =>
            props.handleDropSetInput(props.id, "reps", itemValue)
          }
        >
          {pickerItems(100)}
        </Picker>
      )}
      {props.type === "dropsetWeight" && (
        <Picker
          mode={"dropdown"}
          selectedValue={props.weight}
          onValueChange={(itemValue) =>
            props.handleDropSetInput(props.id, "weight", itemValue)
          }
        >
          {pickerItems(100, true, 10)}
        </Picker>
      )}
    </View>
  );
}

export default TimePickerComponent;
