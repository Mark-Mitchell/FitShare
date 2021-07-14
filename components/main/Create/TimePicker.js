// Can't use @react-native-picker/picker with expo managed build, so currently uses deprecated but working Picker from react-native
// import { Picker } from "@react-native-picker/picker";

import React, { useState, useEffect } from "react";
import { View, Picker } from "react-native";

function TimePickerComponent(props) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Every time state changes, update total amount of time in parent component
  useEffect(() => {
    const totalTimeInSeconds = parseInt(minutes) * 60 + parseInt(seconds);
    props.handleInput("time", totalTimeInSeconds);
  }, [minutes, seconds]);

  // Makes list of numbers for the dropdowns
  const pickerItems = (maxNumber) => {
    let array = [];
    for (let i = 0; i < maxNumber + 1; i++) {
      array.push(<Picker.Item label={i.toString()} value={i} key={i} />);
    }
    return array;
  };

  return (
    <View>
      <Picker
        mode={"dropdown"}
        selectedValue={minutes}
        onValueChange={(itemValue, itemIndex) => setMinutes(itemValue)}
      >
        {pickerItems(60)}
      </Picker>

      <Picker
        selectedValue={seconds}
        onValueChange={(itemValue, itemIndex) => setSeconds(itemValue)}
      >
        {pickerItems(59)}
      </Picker>
    </View>
  );
}

export default TimePickerComponent;
