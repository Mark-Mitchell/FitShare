import React from "react";
import { Button, View } from "react-native";
import PickerComponent from "./PickerComponent";

function DropSets(props) {
  const addDropsetInput = () => {
    const dropSetId = props.generateId(props.state.dropSetInfo);
    props.setState({
      ...props.state,
      dropSetInfo: {
        ...props.state.dropSetInfo,
        [dropSetId]: {
          reps: 0,
          weight: 0,
        },
      },
    });
  };

  const deleteDropSetInput = (dropSetId) => {
    const dropSetInfo = props.state.dropSetInfo;
    delete dropSetInfo[dropSetId];
    props.setState({
      ...props.state,
      dropSetInfo,
    });
  };

  // handle input from DropSets (key = reps or weight)
  const handleDropSetInput = (id, key, value) => {
    props.setState({
      ...props.state,
      dropSetInfo: {
        ...props.state.dropSetInfo,
        [id]: {
          ...props.state.dropSetInfo[id],
          [key]: value,
        },
      },
    });
  };

  const dropSetInputs = Object.keys(props.state.dropSetInfo).map(
    (dropSetId) => (
      <View key={dropSetId}>
        <PickerComponent
          type="dropsetReps"
          reps={props.state.dropSetInfo[dropSetId].reps}
          handleDropSetInput={handleDropSetInput}
          id={dropSetId}
        />

        <PickerComponent
          type="dropsetWeight"
          weight={props.state.dropSetInfo[dropSetId].weight}
          handleDropSetInput={handleDropSetInput}
          id={dropSetId}
        />

        <Button
          style={props.styles.halfButton}
          onPress={() => deleteDropSetInput(dropSetId)}
          title="Delete DropSet"
        />
      </View>
    )
  );

  return (
    <View>
      {props.state.dropSets && (
        <View>
          <Button onPress={() => addDropsetInput()} title="Add Dropset" />

          <View>{dropSetInputs}</View>
        </View>
      )}
    </View>
  );
}

export default DropSets;
