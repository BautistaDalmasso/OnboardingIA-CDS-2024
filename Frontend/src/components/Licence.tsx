import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Licence = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pronto podrás obtener tu carnet</Text>
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
});

export default Licence;
