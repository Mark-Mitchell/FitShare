import exercisesReducer from "./exercises";
import equipmentPickerReducer from "./equipmentPicker";

import { combineReducers } from "redux";

const allReducers = combineReducers({
  exercises: exercisesReducer,
  equipmentPicker: equipmentPickerReducer,
});

export default allReducers;
