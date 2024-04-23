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
import { encryptWithPrivateKey, generateKeyPair } from "../common/utils/crypto";
import useBiometrics from "../hooks/useBiometrics";
import { ConnectionType } from "../common/enums/connectionType";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setContextState } = useContextState();
  const { authenticate } = useBiometrics();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handlePasswordLogin = async () => {
    try {
      setLoading(true);

      if (!emailRegex.test(email) || password.length < 6) {
        Alert.alert(
          "Por favor",
          "Ingrese un correo valido y una contraseña de más de 6 caracteres."
        );
        return null;
      }

      const response = await UserService.login(email, password);

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
        setPassword("");
        return response.access_token;
      }

      if (response.detail) {
        Alert.alert("Error", response.detail);
      }

      return null;
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    await handlePasswordLogin();
  };

  const handleFingerprintRegistration = async () => {
    const accessToken = await handlePasswordLogin();

    if (accessToken === null) {
        return;
    }

    const successBiometric = await authenticate();
    if (!successBiometric) {
      Alert.alert("Error", "Autenticación fallida");
      return;
    }

    const { privateKey, publicKey } = generateKeyPair();

    await UserService.updatePublicKey(
      JSON.stringify(publicKey),
      accessToken,
      email
    );

    await SecureStore.setItemAsync(
      "privateKey",
      JSON.stringify(privateKey)
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa a tu cuenta</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {showPassword && (
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
        {!showPassword && (
          <Image
            source={require("../assets/fingerprint.png")}
            style={styles.fingerprintIcon}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
      {showPassword && (
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
      )}
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
  linkText: {
    color: "#3369FF",
    marginTop: 25,
    textAlign: "center",
  },
  fingerprintIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});

export default Login;
