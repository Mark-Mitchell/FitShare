import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

function ImagePickerComponent(props) {
  // Request Permissions to acces photos on mobile
  useEffect(() => {
    async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") alert("Please enable Camera Permissions.");
      }
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.cancelled) {
      // set image uri in parent component
      props.setImage(result.uri);
    }
  };

  return (
    <View>
      <Button title="Image Picker" onPress={() => pickImage()} />
      {props.imgURI !== "" && (
        <Image
          source={{ uri: props.imgURI }}
          style={{ width: 200, height: 200 }}
        />
      )}
    </View>
  );
}

export default ImagePickerComponent;
