import exercisesReducer from "./exercises";

import { combineReducers } from "redux";

const allReducers = combineReducers({
  exercises: exercisesReducer,
});

export default allReducers;
