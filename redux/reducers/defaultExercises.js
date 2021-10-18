const defaultExercisesReducer = (state = {}, action) => {
  switch (action.type) {
    case "FETCH_DEFAULT_EXERCISES":
      return action.payload ? action.payload : state;
    default:
      return state;
  }
};

export default defaultExercisesReducer;
