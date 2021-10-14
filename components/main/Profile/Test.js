import React from "react";
import { Button, Platform } from "react-native";
import { apiURL } from "../../../assets/config/api.config";
import { getAccessToken, saveAccessToken } from "../../auth/accessToken";
import getUserInfo from "../../auth/getUserInfo";

function Test() {
  const uploadWorkout = async () => {
    const token = await getAccessToken();
    try {
      let response = await fetch(apiURL + "api/unlistedWorkout/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          workout: "test",
          // id: 999,
          userId: 1,
          // email: "test",
        }),
      });
      console.log(response);
      let json = await response.json();
      return console.log(json);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAPI = async () => {
    try {
      let response = await fetch(apiURL + "api/auth/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "test",
          password: "sdkjksjdkjdjdsk",
          email: "test@test.com",
        }),
      });
      let json = await response.json();
      return console.log(json);
    } catch (err) {
      console.log(err);
    }
  };

  const signIn = async () => {
    try {
      let response = await fetch(apiURL + "api/auth/signin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "sdkjksjdkjdjdsk",
        }),
      });
      let json = await response.json();
      return saveAccessToken(json.accessToken);
    } catch (err) {
      console.log(err);
    }
  };

  const token = async () => {
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
        return console.log("LOGIN AGAIN; TOKEN EXPIRED");
      } else {
        return console.log("not expired");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //   const isAdmin = async () => {
  //     try {
  //       const token = ""
  //       const response = await fetch(apiURL + "api/test/admin", {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //           "x-access-token": token,
  //         },
  //       }).then((res) => console.log(res));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  const apiTest = async () => {
    try {
      let response = await fetch(apiURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => res.json().then((out) => console.log(out)));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button title="DEV Sign Up" onPress={() => fetchAPI()} />
      <Button title="DEV SignIn" onPress={() => signIn()} />
      <Button title="DEV Test Token" onPress={() => token()} />
      {/* <Button title="Admin Check" onPress={() => isAdmin()} /> */}
      <Button title="DEV PUBLIC API TEST" onPress={() => apiTest()} />
      <Button
        title="Get User Info"
        onPress={async () => console.log(await getUserInfo())}
      />
      <Button title="Upload Unlisted Workout" onPress={() => uploadWorkout()} />
    </>
  );
}

export default Test;
