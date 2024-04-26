import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Button from "./Button";
import { FacialRecognitionService } from "../services/facialRecognitionService";

export default function Capture() {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [image, setImage] = useState<string>("");
  const [cameraType, setType] = useState(CameraType.front);
  const [flash, setFlash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
        // TODO: temporary, erase later
        const response = await FacialRecognitionService.registerFace("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoZWxsQGdtYWlsLmNvbSIsImV4cCI6MTcxNDE2MjI4OH0.2NEc6HyKyp5p69joDmDjDV8j5wZo4SE5AervNTkIzIg",
            data.uri
        );
        console.log("test")
        console.log(response)
      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        alert("Picture saved! 🎉");
        setImage("");
        console.log("saved successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const switchCamera = () => {
    setType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back,
    );
  };

  const switchFlash = () => {
    setFlash(flash === FlashMode.off ? FlashMode.on : FlashMode.off);
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
          flashMode={flash}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            }}
          >
            <Button title="" icon="retweet" onPress={switchCamera} />
            <Button
              onPress={switchFlash}
              icon="flash"
              color={flash === FlashMode.off ? "gray" : "#fff"}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}

      <View style={styles.controls}>
        {image ? (
          <View style={styles.retakeButton}>
            <Button
              title="Re-take"
              onPress={() => setImage("")}
              icon="retweet"
            />
            <Button title="Save" onPress={savePicture} icon="check" />
          </View>
        ) : (
          <Button title="Take a picture" onPress={takePicture} icon="camera" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#000",
    padding: 8,
  },
  controls: {
    flex: 0.5,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#E9730F",
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
  retakeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
});
