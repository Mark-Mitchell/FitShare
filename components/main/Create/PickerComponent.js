// Can't use @react-native-picker/picker with expo managed build, so currently uses deprecated but working Picker from react-native
// import { Picker } from "@react-native-picker/picker";

import React, { useState, useEffect } from "react";
import { View, Picker } from "react-native";

function TimePickerComponent(props) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Makes list of numbers for the dropdowns
  const pickerItems = (maxNumber) => {
    let array = [];
    for (let i = 0; i < maxNumber + 1; i++) {
      array.push(<Picker.Item label={i.toString()} value={i} key={i} />);
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

      {props.type === "reps" && (
        <Picker
          mode={"dropdown"}
          selectedValue={props.reps}
          onValueChange={(itemValue) => props.handleInput("reps", itemValue)}
        >
          {pickerItems(100)}
        </Picker>
      )}
    </View>
  );
}

export default TimePickerComponent;
