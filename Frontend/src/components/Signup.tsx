import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { UserService } from "../services/userService";
import { NavigationProp } from "@react-navigation/native";
import { Routes } from "../common/enums/routes";
import { useContextState } from "../ContexState";
import { generateKeyPair } from "../common/utils/crypto";
import useBiometrics from "../hooks/useBiometrics";
import { ConnectionType } from "../common/enums/connectionType";
import CustomTextInput from "./CustomTextInput";
import { OfflineStorageService } from "../services/offlineStorageService";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Signup = ({ navigation }: Props) => {
  const [firstName, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setContextState } = useContextState();
  const { authenticate, isBiometricAvailable } = useBiometrics();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    try {
      if (!firstName || !lastName) {
        Alert.alert(
          "Error",
          "Por favor complete el formulario antes de enviar.",
        );
        return;
      }
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Por favor ingrese un correo valido.");
        return;
      }
      if (password.length < 6 || password.includes(" ")) {
        Alert.alert(
          "Error",
          "Por favor ingrese una contraseña de 6 caracteres.",
        );
        return;
      }

      const response = await UserService.create({
        email,
        password,
        firstName,
        lastName,
      });

      if (response.access_token) {
        if (isBiometricAvailable) {
          const autenticated = await authenticate();
          if (!autenticated) return;

          const { privateKey, publicKey } = generateKeyPair();

          await UserService.updatePublicKey(
            JSON.stringify(publicKey),
            response.access_token,
            email,
          );

          await SecureStore.setItemAsync(
            "privateKey",
            JSON.stringify(privateKey),
          );
        }

        setContextState((state) => ({
          ...state,
          user: response.user,
          connectionType: ConnectionType.ONLINE,
          accessToken: response.access_token,
          messages: [],
        }));
        navigation.navigate(Routes.Home);
        Alert.alert("¡Usted ha sido registrado con exito!.");
        await OfflineStorageService.storeLastUser(response.user);

        setName("");
        setLastName("");
        setEmail("");
        setPassword("");
      }

      if (response.detail) Alert.alert("Error", response.detail);
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>
      <CustomTextInput
        placeholder={"Nombre"}
        value={firstName}
        onChangeText={(text) => setName(text)}
      />
      <CustomTextInput
        placeholder={"Apellido"}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <CustomTextInput
        placeholder={"Email"}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <CustomTextInput
        placeholder={"Contraseña"}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Registrarme</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#3369FF",
  },
  button: {
    backgroundColor: "#3369FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "100%",
    marginTop: 20,
    maxWidth: 330,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Signup;
