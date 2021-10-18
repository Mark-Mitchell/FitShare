// Can't use @react-native-picker/picker with expo managed build, so currently uses deprecated but working Picker from react-native
import React, { useState } from "react";
import { View, Picker, Text } from "react-native";
import formatTime from "../../../../assets/styling/formatTime";

function TimePickerComponent(props) {
  const startTime =
    props.hasOwnProperty("startTime") && props.startTime ? props.startTime : 0;
  const time = formatTime(startTime, true);
  const [minutes, setMinutes] = useState(time.minutes);
  const [seconds, setSeconds] = useState(time.seconds);

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
        <>
          <View
            style={{
              flexDirection: "row",
              borderTopWidth: 1,
              padding: 5,
              margin: 5,
            }}
          >
            <View style={{ width: "50%", alignItems: "center" }}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                minutes
              </Text>
            </View>
            <View
              style={{ width: "50%", alignItems: "center", borderLeftWidth: 1 }}
            >
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                seconds
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Picker
              mode={"dropdown"}
              selectedValue={minutes}
              onValueChange={(itemValue) =>
                handleTimeInput("minutes", itemValue)
              }
              style={{ width: "49%" }}
            >
              {pickerItems(60)}
            </Picker>

            <Picker
              selectedValue={seconds}
              onValueChange={(itemValue) =>
                handleTimeInput("seconds", itemValue)
              }
              style={{ width: "49%" }}
            >
              {pickerItems(59)}
            </Picker>
          </View>
        </>
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
