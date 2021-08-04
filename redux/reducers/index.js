import { combineReducers } from "redux";

import exercisesReducer from "./exercises";
import equipmentPickerReducer from "./equipmentPicker";
import selectedExercisesReducer from "./selectedExercises";

const allReducers = combineReducers({
  exercises: exercisesReducer,
  equipmentPicker: equipmentPickerReducer,
  selectedExercises: selectedExercisesReducer,
});

export default allReducers;
