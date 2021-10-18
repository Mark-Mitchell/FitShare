import React, { useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalStyles from "../../../../assets/styling/GlobalStyles";
import { defaultLightColor } from "../../../../assets/styling/GlobalColors";

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
      {/* <Button title="Image Picker" onPress={() => pickImage()} /> */}
      <TouchableOpacity
        style={[
          GlobalStyles.optionButton,
          {
            backgroundColor: Platform.OS === "web" ? "gray" : defaultLightColor,
          },
        ]}
        onPress={() => (Platform.OS === "web" ? null : pickImage())}
      >
        <MaterialCommunityIcons
          name={Platform.OS === "web" ? "image-off" : "image-filter-hdr"}
          size={15}
        />
        <Text style={GlobalStyles.optionButtonText}>Image</Text>
      </TouchableOpacity>
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
