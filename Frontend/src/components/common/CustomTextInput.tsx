import React, { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const CustomTextInput = ({ placeholder, value, onChangeText }: Props) => {
  const secureTextEntry = placeholder === "Contraseña";
  const [error, setError] = useState("");

  const handleBlur = () => {
    onChangeText(value.trim());
  };

  const handleInputChange = (text: string) => {
    if (
      (placeholder === "Nombre" || placeholder === "Apellido") &&
      !/^[\p{L}\s]*$/u.test(text)
    ) {
      setError("Solo se permiten letras.");
      return;
    }
    setError("");
    onChangeText(text);
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={handleInputChange}
        onBlur={handleBlur}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 65,
    width: "100%",
    borderColor: "#E6E6E6",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 15,
    maxWidth: 330,
  },
  error: {
    color: "red",
    marginTop: 5,
    marginHorizontal: 15,
  },
});

export default CustomTextInput;
