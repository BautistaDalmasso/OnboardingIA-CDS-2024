import { NavigationProp } from "@react-navigation/native";
import { FacialRecognitionService } from "../../services/facialRecognitionService";
import React, { useEffect, useState } from "react";
import { Routes } from "../../common/enums/routes";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import useFinalizeLogin from "../../hooks/useFinalizeLogin";
import FaceRecognition from "./FaceRecognition/FaceRecognition";
import { useContextState } from "../../ContexState";
import useOfflineStorage from "../../hooks/useOfflineStorage";
import useOfflineAuth from "../../hooks/useOfflineAuth";
import { isSameFace } from "../../common/utils/face-recognition";
import { IUser } from "../../common/interfaces/User";

interface Props {
  navigation: NavigationProp<any, any>;
}

const LoginFace = ({ navigation }: Props) => {
  const { contextState } = useContextState();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<IUser | null>(null);
  const [capturing, setCapturing] = useState(false);
  const { finalizeLogin } = useFinalizeLogin();
  const { offlineAuthenticate } = useOfflineAuth();
  const { getLastUser } = useOfflineStorage();

  const setLastUser = async () => {
    if (!contextState.isConnected) {
      const user = await getLastUser()
      if (!user) return Alert.alert("No hay ningún usuario guardado en este dispositivo.");
      setUser(user)
      setEmail(user?.email)
    }
  }

  useEffect(() => {
    setLastUser();
  }, [])

  const handleError = (error: unknown) => {
    console.error("Error logging in:", error);
    Alert.alert("No pudimos verificar tu identidad.");
  }

  const handleFaceLogin = async (embedding: number[]) => {
    try {
      const response = await FacialRecognitionService.compareFace(
        email,
        embedding,
      );

      const loginSuccess = await finalizeLogin(response);

      if (loginSuccess) {
        navigation.navigate(Routes.Home);

        setEmail("");
      }
    } catch (error) {
      handleError(error)
    } finally {
      setCapturing(false);
    }
  }

  const handleFaceLoginOffline = (embedding: number[]) => {
    try {
      if (!user) {
        Alert.alert("No hay ningún usuario guardado en este dispositivo.");
        setCapturing(false);
        return;
      }
      const sameFace = isSameFace(user?.embedding, embedding);
      if (!sameFace) throw new Error("Faces dont match");
      offlineAuthenticate();
      navigation.navigate(Routes.Home);
    } catch (error) {
      handleError(error)
    } finally {
      setCapturing(false);
    }
  }

  return (
    <>
      {capturing && <FaceRecognition onSubmit={contextState.isConnected ? handleFaceLogin : handleFaceLoginOffline} />}
      {!capturing && (
        <View style={styles.container}>
          <Text style={styles.title}>Ingresa a tu cuenta</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              if (contextState.isConnected) setEmail(text)
            }}
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
