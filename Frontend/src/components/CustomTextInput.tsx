import React, { useState, useEffect } from 'react';
import { Alert, TextInput, StyleSheet, Keyboard } from 'react-native';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const CustomTextInput = ({ placeholder, value, onChangeText }: Props) => {
  const [secureTextEntry, setSecureTextEntry] = useState(
    placeholder === 'Contraseña'
  );

  const handleBlur = () => {
    onChangeText(value.trim());
  };

  const handleInputChange = (text: string) => {
    if (
      (placeholder === 'Nombre' || placeholder === 'Apellido') &&
      !/^[a-zA-Z\s]*$/.test(text)
    ) {
      Alert.alert('Error', 'Solo se permiten letras.');
      return;
    }
    onChangeText(text);
  };

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={handleInputChange}
      onBlur={handleBlur}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 15,
    maxWidth: 330,
  },
});

export default CustomTextInput;
