import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: Props) => {
  const handleContinue = () => {
    // Aquí puedes navegar a la siguiente pantalla del chat
    navigation.navigate("Chat");
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Bienvenido al Chatbot</Text>
        <Text style={styles.subtitle}>
          Estás a punto de comenzar una conversación
        </Text>
      </View>
      <Image
        source={require("../assets/login-image.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
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
  },
  image: {
    height: 300,
  },
  button: {
    backgroundColor: "#3369FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "85%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Login;
