import React, { useState } from 'react';
import {
  Alert,
  Image,
  TouchableOpacity,
  Keyboard,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';

interface Props {
  placeholder?: string;
  secureTextEntry?: boolean;
  set: React.Dispatch<React.SetStateAction<string>>;
}

export default function FormTextInput({
  placeholder,
  secureTextEntry,
  set,
}: Props) {
  const [inputText, setInputText] = useState('');

  const emailRegex =
    /^[a-z]+([\.-]?[a-z]+)*@[a-z]+([\.-]?[a-z]+)*(\.\w{2,3})?$/;

  const saveInput = () => {
    if (!inputText) {
      Alert.alert('Error', 'Por favor no envie sin ingresar algo primero.');
      return;
    }
    if (placeholder === 'email') {
      if (!emailRegex.test(inputText)) {
        Alert.alert(
          'Error',
          'Por favor ingrese un correo valido sin mayusculas.'
        );
        return;
      } else {
        setInputText(inputText.toLowerCase());
      }
    }

    if (
      placeholder === 'Contraseña' &&
      (/\s+/.test(inputText) || inputText.length < 6)
    ) {
      Alert.alert(
        'Error',
        'Por favor ingrese una contraseña de 6 caracteres sin espacios.'
      );
      return;
    }

    if (inputText.trim().length) {
      set(inputText.trim());
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        value={inputText}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => setInputText(text)}
        onSubmitEditing={saveInput}
      />
      <TouchableOpacity onPress={saveInput} style={styles.sendButtonContainer}>
        <Image
          source={require('../assets/send-message-button.png')}
          style={styles.sendButton}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
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

  sendButtonContainer: {
    right: 40,
  },
  sendButton: {
    width: 18,
  },
});
