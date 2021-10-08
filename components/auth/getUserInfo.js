import { apiURL } from "../../assets/config/api.config";
import { getAccessToken } from "./accessToken";

const getUserInfo = async () => {
  let output = {
    loggedIn: false,
    error: null,
    success: null,
    user: undefined,
  };

  try {
    const token = await getAccessToken();

    const response = await fetch(apiURL + "api/test/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });
    const json = await response.json();

    if (json.message.includes("TokenExpiredError")) {
      output = {
        ...output,
        loggedIn: false,
        error: "TokenExpiredError",
      };
    } else if (json.message.includes("NoTokenError")) {
      output = {
        ...output,
        loggedIn: false,
        error: "NoTokenError",
      };
    } else if (json.message.includes("Unauthorized")) {
      output = {
        ...output,
        loggedIn: false,
        error: "InvalidToken",
      };
    } else if (json.message.includes("SUCCESS")) {
      output = {
        ...output,
        loggedIn: true,
        success: json.message.replace("SUCCESS: ", ""),
        user: json.user,
      };
    } else {
      output = {
        ...output,
        loggedIn: false,
        error: "Something went wrong. Please close the app and then try again.",
      };
    }
  } catch (err) {
    console.log(err);
  }

  return output;
};

export default getUserInfo;
