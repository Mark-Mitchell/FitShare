export const fetchLocalData = (payload) => {
  return {
    type: "FETCH_LOCAL_DATA",
    payload,
  };
};

export const fetchEquipmentPicker = (payload) => {
  return {
    type: "FETCH_EQUIPMENT_PICKER",
    payload,
  };
};

export const fetchSelectedExercises = (payload) => {
  return {
    type: "FETCH_SELECTED_EXERCISES",
    payload,
  };
};

export const fetchLocalWorkouts = (payload) => {
  return {
    type: "FETCH_LOCAL_WORKOUTS",
    payload,
  };
};

export const fetchDefaultExercises = (payload) => {
  return {
    type: "FETCH_DEFAULT_EXERCISES",
    payload,
  };
};
