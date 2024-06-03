import React, { useState } from "react";
import CustomTextInput from "../../common/CustomTextInput";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface SelectUserProps {
  inputValue: string;
  onPressSearch: (userEmail: string) => void;
  onPressScanQr: () => void;
}

const SelectUser = ({ onPressSearch, onPressScanQr }: SelectUserProps) => {
  const [userEmail, setUserEmail] = useState("");

  return (
    <>
      <Text style={styles.instruction}>
        Ingrese el email del usuario registrado o escanee el QR.
      </Text>
      <CustomTextInput
        placeholder={"email"}
        value={userEmail}
        onChangeText={(text) => setUserEmail(text)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onPressSearch(userEmail)}
      >
        <Text style={styles.buttonText}>Buscar Usuario</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonQR} onPress={onPressScanQr}>
        <Text style={styles.buttonText}>Escanear QR</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  instruction: {
    bottom: 15,
    marginBottom: 5,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#3369FF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 100,
    maxWidth: 300,
    margin: 10,
  },
  buttonQR: {
    backgroundColor: "#48bce4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    maxWidth: 300,
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SelectUser;
