import React from "react";
import { TouchableOpacity, Text, View, Dimensions } from "react-native";
import { Avatar } from "react-native-magnus";
import GlobalStyles from "../../../assets/styling/GlobalStyles";
import { removeAccessToken } from "../../auth/accessToken";

function ProfilePage(props) {
  const logout = async () => {
    removeAccessToken();
    props.setUserInfo({ loggedIn: false });
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Avatar
        shadow={1}
        size={Dimensions.get("window").height / 3}
        source={require("../../../images/AirWorkout-Logo.png")}
      />
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Username:</Text>
        <Text style={{ fontStyle: "italic", fontSize: 22 }}>
          {" "}
          {props.user.username}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Email:</Text>
        <Text style={{ fontStyle: "italic", fontSize: 22 }}>
          {" "}
          {props.user.email}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("UpdateEmail")}
          style={GlobalStyles.optionButton}
        >
          <Text style={GlobalStyles.optionButtonText}>Change your Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate("UpdateUsername")}
          style={GlobalStyles.optionButton}
        >
          <Text style={GlobalStyles.optionButtonText}>
            Change your Username
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={GlobalStyles.defaultButton}
        onPress={() => logout()}
      >
        <Text style={GlobalStyles.defaultButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfilePage;
