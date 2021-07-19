import { defaultEquipment } from "../../assets/exercise data/equipment";

const equipmentPickerReducer = (state = defaultEquipment, action) => {
  switch (action.type) {
    case "FETCH_EQUIPMENT_PICKER":
      return action.payload ? action.payload : state;
    default:
      return state;
  }
};

export default equipmentPickerReducer;
