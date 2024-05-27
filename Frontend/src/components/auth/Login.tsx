import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Routes } from "../../common/enums/routes";
import { UserService } from "../../services/userService";
import useFinalizeLogin from "../../hooks/useFinalizeLogin";
import { isValidEmail, isValidPassword } from "../../common/utils/inputCheck";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { finalizeLogin } = useFinalizeLogin();

  const handlePasswordLogin = async () => {
    try {
      setLoading(true);

      if (!isValidEmail(email) || !isValidPassword(password)) {
        Alert.alert(
          "Por favor",
          "Ingrese un correo valido y una contraseña de más de 6 caracteres.",
        );
        return null;
      }

      const response = await UserService.login(email, password);

      const loginSuccess = await finalizeLogin(response);

      if (loginSuccess) {
        navigation.navigate(Routes.Home);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Error logging in:", error);
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
