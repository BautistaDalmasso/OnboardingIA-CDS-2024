import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { UserService } from "../services/userService";
import { useContextState } from "../ContexState";
import { Routes } from "../../src/common/enums/routes";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setContextState } = useContextState();
  const [loading, setLoading] = useState(false);
  
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa a tu cuenta</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <Text
        style={styles.linkText}
       
      >
       
      </Text>
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
});

export default Login;
