import React from "react";
import { View, Text } from "react-native";

function Loading(props) {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
        Loading...
      </Text>
      <Text style={{ fontStyle: "italic", fontSize: 14, textAlign: "center" }}>
        Please hold on while we're fetching the information for you!
      </Text>
      {!!(props.hasOwnProperty("moreInfo") && props.moreInfo) && (
        <Text
          style={{ fontStyle: "italic", fontSize: 14, textAlign: "center" }}
        >
          {props.moreInfo}
        </Text>
      )}
    </View>
  );
}

export default Loading;
