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
