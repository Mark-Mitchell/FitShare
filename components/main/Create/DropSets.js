import React from "react";
import { Button, View, TextInput } from "react-native";

function DropSets(props) {
  const addDropsetInput = () => {
    const dropSetId = props.generateId(props.state.dropSetInfo);
    props.setState({
      ...props.state,
      dropSetInfo: {
        ...props.state.dropSetInfo,
        [dropSetId]: "",
      },
    });
  };

  const handleDropSetInput = (id, value) => {
    props.setState({
      ...props.state,
      dropSetInfo: {
        ...props.state.dropSetInfo,
        [id]: value,
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

  const dropSetInputs = Object.keys(props.state.dropSetInfo).map(
    (dropSetId) => (
      <View key={dropSetId}>
        <TextInput
          style={props.styles.input}
          placeholder="DropSet 1"
          onChangeText={(val) => handleDropSetInput(dropSetId, val)}
          value={props.state.dropSetInfo[dropSetId]}
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
