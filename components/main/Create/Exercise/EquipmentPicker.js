import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Div, Image, Text } from "react-native-magnus";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { fetchEquipmentPicker } from "../../../../redux/actions";

import { equipmentIcons } from "../../../../assets/exercise data/equipment";
import { lightBackgroundColor } from "../../../../assets/styling/GlobalColors";

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

    const pic = equipmentIcons[item];

    return (
      <Pressable
        key={item}
        onPress={() => handleClick(item)}
        style={{ borderRadius: 10, overflow: "hidden" }}
      >
        <View
          style={{
            borderRadius: 10,
            overflow: "hidden",
            width: Dimensions.get("window").width / 2 - 10,
            margin: 5,
            backgroundColor: equipment[item] ? "blue" : lightBackgroundColor,
          }}
        >
          <Image source={pic} h={120} roundedTop="lg" />
          <Div p={10}>
            <Text fontWeight="bold" fontSize="xl">
              {itemName}
            </Text>
          </Div>
        </View>
      </Pressable>
    );
  });

  return (
    <ScrollView>
      <Text
        style={{
          fontSize: 12,
          fontStyle: "italic",
          textAlign: "center",
          margin: 10,
        }}
      >
        Select the equipment required for your exercise by clicking on the tile.
        Your selection is saved automatically.
      </Text>
      <View style={styles.container}>{equipmentPressables}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});

export default Equipment;
