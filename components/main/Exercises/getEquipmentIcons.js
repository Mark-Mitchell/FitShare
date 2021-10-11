import React from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { equipmentIcons } from "../../../assets/exercise data/equipment";

const getEquipmentIcons = (object, iconSize = 10) => {
  const equipment = Object.keys(object).filter(
    (equipmentItem) => object[equipmentItem] && equipmentItem
  );
  const equipmentComponents = equipment.map((equipmentItem) => (
    <MaterialCommunityIcons
      key={equipmentItem}
      name={equipmentIcons[equipmentItem]}
      color={"black"}
      size={iconSize}
    />
  ));
  return equipmentComponents;
};

export default getEquipmentIcons;
