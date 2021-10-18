import * as SecureStore from "expo-secure-store";

export const saveAccessToken = async (token) => {
  const hasSecureStore = await SecureStore.isAvailableAsync();
  // if SecureStore is available use it, otherwise save it in Window.sessionStorage (for the web)
  if (hasSecureStore) {
    await SecureStore.setItemAsync("accessToken", token);

    // check if token is saved and acessible
    const data = await getAccessToken();

    if (!data)
      return "ERROR - Please try to log in again after restarting the app, if this issue persist your device may not be supported";
    return null;
  } else {
    sessionStorage.setItem("accessToken", token);

    // check if token is saved and acessible
    const data = await getAccessToken();
    // const data = sessionStorage.getItem("accessToken");
    if (!data)
      return "ERROR - Please try to log in again after restarting the app, if this issue persist your device may not be supported";
    return null;
  }
};

export const getAccessToken = async () => {
  const hasSecureStore = await SecureStore.isAvailableAsync();

  let result;

  if (hasSecureStore) {
    result = await SecureStore.getItemAsync("accessToken");
  } else {
    result = sessionStorage.getItem("accessToken");
  }

  return result;
};

export const removeAccessToken = async () => {
  const hasSecureStore = await SecureStore.isAvailableAsync();

  if (hasSecureStore) {
    await SecureStore.deleteItemAsync("accessToken");
  } else {
    sessionStorage.removeItem("accessToken");
  }

  return;
};
