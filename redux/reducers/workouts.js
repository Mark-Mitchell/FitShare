const workoutsReducer = (state = {}, action) => {
  switch (action.type) {
    case "FETCH_LOCAL_WORKOUTS":
      return action.payload ? action.payload : state;
    default:
      return state;
  }
};

export default workoutsReducer;
