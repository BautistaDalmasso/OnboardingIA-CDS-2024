import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";
<<<<<<< HEAD
import { Camera,CameraType, FlashMode } from "expo-camera/legacy";
=======
import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraType, FlashMode } from "expo-camera/legacy";
>>>>>>> 4921edfb858e03a9ca6525c48e6f6254b764db4d
import * as MediaLibrary from "expo-media-library";
import Button from "./Button";

interface Props {
  onAccept: (imageURI: string) => Promise<void>;
}

const Capture = ({ onAccept }: Props) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const isFocused = useIsFocused();
  const [image, setImage] = useState<string>("");
  const [cameraType, setType] = useState(CameraType.front);
  const [flash, setFlash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    setIsDisabled(true);
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const reTake = async () => {
    setIsDisabled(false);
    setImage("");
  };

  const savePicture = async () => {
    if (image) {
      try {
        await onAccept(image);
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
      {!image && isFocused ? (
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
          flashMode={flash}
        />
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}

      <View style={styles.controls}>
        {image ? (
          <View style={styles.retakeButton}>
            <Button
              title="Re-take"
              onPress={reTake}
              icon="camera"
              width={150}
              height={60}
              color="#006694"
            />
            <Button
              title="Save"
              onPress={savePicture}
              icon="check"
              width={150}
              height={60}
              color="#006694"
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <Button
              title=""
              icon="retweet"
              onPress={switchCamera}
              width={60}
              height={60}
              color="#006694"
            />
            <Button
              title="Take a picture"
              onPress={takePicture}
              icon="camera"
              width={200}
              height={60}
              color="#006694"
              disabled={isDisabled}
            />
            <Button
              onPress={switchFlash}
              icon="flash"
              width={60}
              height={60}
              color={flash === FlashMode.off ? "gray" : "#006694"}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#000",
    padding: 8,
  },
  controls: {
    marginTop: 15,
    flex: 0.5,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  retakeButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

export default Capture;
