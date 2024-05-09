import { NavigationProp } from "@react-navigation/native";
import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { UserService } from "../services/userService";
import { useContextState } from "../ContexState";
import useBiometrics from "../hooks/useBiometrics";
import { generateKeyPair } from "../common/utils/crypto";
import React, { useState } from "react";
import { Routes } from "../common/enums/routes";

interface Props {
  navigation: NavigationProp<any, any>;
}

const UserConfiguration = ({ navigation }: Props) => {
  const { contextState } = useContextState();
  const { authenticate } = useBiometrics();
  const [loading, setLoading] = useState(false);

  const handleFingerprintRegistration = async () => {
    setLoading(true);

    if (contextState.accessToken === null) {
      throw Error("User not correctly logged in.");
    }
    if (contextState.user === null) {
      throw Error("User not correctly logged in.");
    }

    const successBiometric = await authenticate();
    if (!successBiometric) {
      Alert.alert("Error", "Autenticación fallida");
      return;
    }

    const { privateKey, publicKey } = generateKeyPair();

    await UserService.updatePublicKey(
      JSON.stringify(publicKey),
      contextState.accessToken,
      contextState.user?.email,
    );

    await SecureStore.setItemAsync("privateKey", JSON.stringify(privateKey));

    Alert.alert("Huella registrada para este dispositivo!");

    setLoading(false);
  };

  function handleRegisterFace() {
    navigation.navigate(Routes.RegisterFace);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleFingerprintRegistration}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Registrar Huella</Text>
        <Image
          source={require("../assets/fingerprint.png")}
          style={styles.fingerprintIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegisterFace}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Registrar Rostro</Text>
      </TouchableOpacity>
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
  fingerprintIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});

export default UserConfiguration;
