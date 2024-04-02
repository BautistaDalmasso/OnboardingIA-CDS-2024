import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Routes } from "../common/enums/routes";
import { useContextState } from "../ContexState";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: Props) => {
  const { contextState } = useContextState();

  const handleContinue = () => {
    navigation.navigate(Routes.Chat);
  };

  const handleLogin = () => {
    navigation.navigate(Routes.Login);
  };

  const handleSignup = () => {
    navigation.navigate(Routes.Signup);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>¡Bienvenido al Chatbot!</Text>
        <Text style={styles.subtitle}>
          {contextState.user ? `Hola ${contextState.user.firstName}. ` : ""}
          Pregúntale a Skynet cualquier duda sobre la biblioteca
        </Text>
      </View>
      <Image
        source={require("../assets/login-image.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.buttonsContainer}>
        {contextState.accessToken === null ? (
          <>
            <View style={styles.loginButtonsContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
              >
                <Text style={styles.signupButtonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.continueLink} onPress={handleContinue}>
              {"Continuar sin iniciar sesión >>"}
            </Text>
          </>
        ) : (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.loginButtonText}>Ir al Chat</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#3369FF",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  image: {
    height: 280,
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  loginButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "85%",
  },
  loginButton: {
    backgroundColor: "#3369FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#3369FF",
  },
  signupButton: {
    backgroundColor: "#ffffff",
    borderColor: "#3369FF",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  continueLink: {
    color: "#3369FF",
    marginTop: 25,
    textAlign: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  signupButtonText: {
    color: "#3369FF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#3369FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#3369FF",
    width: "85%",
  },
});

export default Home;
