import React, { useState } from "react";
import {
  TouchableOpacity,
  TextInput,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useLoanCreation from "../../hooks/useLoanCreation";

const LoanCreation = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [inventoryNumber, setInventoryNumber] = useState(0);
  const { assignLoan } = useLoanCreation();

  /*this function is used to return the screen to its original state, in case the user exits the screen */
  useFocusEffect(
    React.useCallback(() => {
      return () => {};
    }, []),
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await assignLoan(inventoryNumber, email);
    } catch (error) {
      console.error("Error en asignar prestamo:", error);
    } finally {
      setEmail("");
      setInventoryNumber(0);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alta de Prestamo</Text>
      <Text style={styles.instruction}>
        Confirmar prestamo de un libro para el usuario del email indicado:{" "}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresar email de usuario ..."
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Ingresar número de inventario..."
        keyboardType="numeric"
        maxLength={13}
        value={inventoryNumber === 0 ? "" : inventoryNumber.toString()}
        onChangeText={(text) => setInventoryNumber(Number(text))}
      ></TextInput>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}> Dar de alta el prestamo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 200,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#48bce4",
    textAlign: "center",
    bottom: 15,
  },
  instruction: {
    marginTop: 0,
    fontSize: 14,
    marginBottom: 40,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#E6E6E6",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
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
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default LoanCreation;
