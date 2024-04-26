import { NavigationProp } from "@react-navigation/native";
import { FacialRecognitionService } from "../services/facialRecognitionService";
import { useContextState } from "../ContexState";
import Capture from "./Capture";
import React, { useState } from "react";
import { Routes } from "../common/enums/routes";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ConnectionType } from "../common/enums/connectionType";

interface Props {
  navigation: NavigationProp<any, any>;
}

const LoginFace = ({ navigation }: Props) => {
  const { contextState, setContextState } = useContextState();
  const [email, setEmail] = useState("");
  const [capturing, setCapturing] = useState(false);

  const sendRegister = async (imageURI: string) => {
    try {
      const response = await FacialRecognitionService.compareFace(
        email,
        imageURI,
      );

      if (response.access_token) {
        setContextState((state) => ({
          ...state,
          user: response.user,
          connectionType: ConnectionType.ONLINE,
          accessToken: response.access_token,
          messages: [],
        }));
        navigation.navigate(Routes.Home);

        setEmail("");
        navigation.navigate(Routes.Home);
      }

      if (response.detail) {
        Alert.alert("Error", response.detail);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      {!capturing && (
        <View style={styles.container}>
          <Text style={styles.title}>Ingresa a tu cuenta</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCapturing(true);
            }}
          >
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      )}
      {capturing && <Capture onAccept={sendRegister}></Capture>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: "50%",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#3369FF",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#E6E6E6",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 15,
    maxWidth: 330,
  },
  button: {
    backgroundColor: "#3369FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "100%",
    marginTop: 20,
    maxWidth: 330,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginFace;
