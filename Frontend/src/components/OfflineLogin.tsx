import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const OfflineLogin = () => {
  return (

    <View style={styles.container}>
      <Text style={styles.title}>¡U! no tienes conexion a Internet :'(</Text>
      <Text >Por favor verifica tu conexion a Internet.</Text>
      <Text style={styles.subtitle}> Igual puedes Ingresar a SKYNET :D</Text>

      <TouchableOpacity
        style={styles.button}
      >
        <Text style={styles.buttonText}>Ingresar sin conexion</Text>
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
    margin: 20,
    textAlign: "center",
    color: "red",
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 40,
    textAlign: "center",
    color: "#48bce4",
  },

  button: {
    backgroundColor: "#48bce4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  linkText: {
    color: "#48bce4",
    marginTop: 25,
    textAlign: "center",
  },
});

export default OfflineLogin;