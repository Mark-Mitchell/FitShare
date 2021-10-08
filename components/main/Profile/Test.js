import React from "react";
import { Button, Platform } from "react-native";
import { apiURL } from "../../../assets/config/api.config";
import { getAccessToken, saveAccessToken } from "../../auth/accessToken";
import getUserInfo from "../../auth/getUserInfo";

function Test() {
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
          password: "test",
          email: "test",
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
          email: "test",
          password: "test",
        }),
      });
      let json = await response.json();
      saveAccessToken(json.accessToken);
      return console.log(json);
    } catch (err) {
      console.log(err);
    }
  };

  const token = async () => {
    try {
      const token = await getAccessToken();
      console.log("Token from Local: " + token);

      const response = await fetch(apiURL + "api/test/user", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": "token",
        },
      });
      const json = await response.json();

      console.log(json);
      console.log(json.message.includes("ERROR"));
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
    </>
  );
}

export default Test;
