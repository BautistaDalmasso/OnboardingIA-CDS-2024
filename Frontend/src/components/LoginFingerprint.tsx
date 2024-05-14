import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";

import { NavigationProp } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Routes } from "../../src/common/enums/routes";
import { UserService } from "../services/userService";
import { useContextState } from "../ContexState";
import { encryptWithPrivateKey } from "../common/utils/crypto";
import useBiometrics from "../hooks/useBiometrics";
import useFinalizeLogin from "../hooks/useFinalizeLogin";

interface Props {
  navigation: NavigationProp<any, any>;
}

const LoginFingerprint = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { setContextState } = useContextState();
  const { authenticate } = useBiometrics();
  const { finalizeLogin } = useFinalizeLogin();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginFingerprint = async () => {
    try {
      setLoading(true);

      if (!emailRegex.test(email)) {
        Alert.alert("Por favor", "Ingrese un correo valido");
        return;
      }

      const privateKey = await SecureStore.getItemAsync("privateKey");
      if (!privateKey) {
        Alert.alert("Error", "Este dispositivo no tiene una cuenta vinculada.");
        return;
      }

      const successBiometric = await authenticate();
      if (!successBiometric) {
        Alert.alert("Error", "Autenticación fallida");
        return;
      }

      const challengeResponse = await UserService.getChallenge(email);
      if (challengeResponse.detail) {
        Alert.alert("Error", challengeResponse.detail);
        return;
      }

      const challengeResult = encryptWithPrivateKey(
        challengeResponse.challenge,
        JSON.parse(privateKey as unknown as string),
      );

      const response = await UserService.verifyChallenge(
        email,
        challengeResult,
      );

      const loginSuccess = await finalizeLogin(response);

      if (loginSuccess) {
        setEmail("");
        navigation.navigate(Routes.Home);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        onPress={handleLoginFingerprint}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
        {
          <Image
            source={require("../assets/fingerprint.png")}
            style={styles.fingerprintIcon}
            resizeMode="contain"
          />
        }
      </TouchableOpacity>
      <Text style={styles.linkText}></Text>
    </View>
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
    color: "#48bce4",
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
    backgroundColor: "#48bce4",
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
  linkText: {
    color: "#48bce4",
    marginTop: 25,
    textAlign: "center",
  },

  fingerprintIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});

export default LoginFingerprint;
