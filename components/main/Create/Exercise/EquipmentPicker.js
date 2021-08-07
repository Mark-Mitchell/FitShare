// uses Redux to pass back information to EditExercise (because you can't pass back information easily with navigation)
import React from "react";
import { View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { fetchEquipmentPicker } from "../../../../redux/actions";

import { equipmentIcons } from "../../../../assets/exercise data/equipment";

function Equipment() {
  // get state from redux
  const equipment = useSelector((state) => state.equipmentPicker);

  // Icons wip
  const icons = equipmentIcons;

  // updates redux onPress
  const dispatch = useDispatch();
  const handleClick = (item) => {
    const updatedEquipment = {
      ...equipment,
      [item]: !equipment[item],
    };
    dispatch(fetchEquipmentPicker(updatedEquipment));
  };

  const equipmentPressables = Object.keys(equipment).map((item) => {
    const itemName = item
      .replace(/([A-Z]+)/g, " $1")
      .replace(/^./, (firstLetter) => firstLetter.toUpperCase())
      .trim();

    return (
      <Pressable key={item} onPress={() => handleClick(item)}>
        <Text>{itemName}</Text>
        <MaterialCommunityIcons
          name={icons[item]}
          color={equipment[item] ? "blue" : "black"}
          size={50}
        />
      </Pressable>
    );
  });

  return <View>{equipmentPressables}</View>;
}

export default Equipment;
