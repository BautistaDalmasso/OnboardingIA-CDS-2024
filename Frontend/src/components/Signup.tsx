import React, { KeyboardEvent, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { UserService } from '../services/userService';
import { NavigationProp } from '@react-navigation/native';
import { Routes } from '../common/enums/routes';
import { useContextState } from '../ContexState';
import { generateKeyPair } from '../common/utils/crypto';
import useBiometrics from '../hooks/useBiometrics';
import { ConnectionType } from '../common/enums/connectionType';

interface Props {
  navigation: NavigationProp<any, any>;
}

const Signup = ({ navigation }: Props) => {
  const [firstName, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setContextState } = useContextState();
  const { authenticate, isBiometricAvailable } = useBiometrics();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showAlertName = (string: String) => {
    Alert.alert(
      'Por Favor',
      'Evite los espacios y solo ingrese letras.\nSi tiene más de un '
      + string +
      ' ingrese solamente uno, el de su preferencia.\nGracias :)',
      [{ text: 'OK', onPress: () => { clearInput(); }, },]
    );
  };

  const clearInput = () => {
    setName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  const handleKeyPressName = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = event.nativeEvent.key;
    if (!/[a-zA-Z]/.test(key)) {
      showAlertName('nombre');
    }
  };

  const handleKeyPressLastName = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = event.nativeEvent.key;
    if (!/[a-zA-Z]/.test(key)) {
      showAlertName('apellido');
    }
  };

  const handleSubmit = async () => {

    try {

      Keyboard.dismiss();
      setLoading(true);

      if (!/^\s]/g.test(firstName) || !/^\s]/g.test(lastName)) {
        Alert.alert(
          'Por favor complete el formulario',
          'Para registrarse ingrese: \n1 nombre,\n1 apellido\nemail y contraseña validos \ny evite ingresar espacios.'
        );
        return;
      }
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Por favor ingrese un correo valido.');
        return;
      }
      if (password.length < 6) {
        Alert.alert(
          'Error',
          'Por favor ingrese una contraseña de 6 caracteres.'
        );
        clearInput();
        return;
      }

      const response = await UserService.create({
        email,
        password,
        firstName,
        lastName,
      });

      if (response.access_token) {
        if (isBiometricAvailable) {
          const autenticated = await authenticate();
          if (!autenticated) return;

          const { privateKey, publicKey } = generateKeyPair();

          await UserService.updatePublicKey(
            JSON.stringify(publicKey),
            response.access_token,
            email
          );

          await SecureStore.setItemAsync(
            'privateKey',
            JSON.stringify(privateKey)
          );
        }

        setContextState((state) => ({
          ...state,
          user: response.user,
          connectionType: ConnectionType.ONLINE,
          accessToken: response.access_token,
          messages: [],
        }));
        navigation.navigate(Routes.Home);
        Alert.alert('¡Usted ha sido registrado con exito!.');
        clearInput();
      }

      if (response.detail) Alert.alert('Error', response.detail);

    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        onKeyPress={handleKeyPressName}
        value={firstName}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="Apellido"
        style={styles.input}
        onKeyPress={handleKeyPressLastName}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
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
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '50%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#3369FF',
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
  button: {
    backgroundColor: '#3369FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: '100%',
    marginTop: 20,
    maxWidth: 330,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Signup;
