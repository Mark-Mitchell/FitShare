import React from "react";

import { equipmentIcons } from "../../../assets/exercise data/equipment";
import { Avatar } from "react-native-magnus";

const getEquipmentIcons = (object = {}, iconSize = 33) => {
  if (!object) return null;
  const equipment = Object.keys(object).filter(
    (equipmentItem) => object[equipmentItem] && equipmentItem
  );
  const equipmentComponents = equipment.map((item) => {
    const pic = equipmentIcons[item];
    return (
      <Avatar
        key={item}
        shadow={1}
        source={pic}
        size={iconSize}
        style={{ margin: iconSize / 10 }}
      />
    );
  });
  return equipmentComponents;
};

export default getEquipmentIcons;
