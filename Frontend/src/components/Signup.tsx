import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { UserService } from '../services/userService';
import { NavigationProp } from '@react-navigation/native';
import { Routes } from '../common/enums/routes';
import { useContextState } from '../ContexState';
import { generateKeyPair } from '../common/utils/crypto';
import useBiometrics from '../hooks/useBiometrics';
import { ConnectionType } from '../common/enums/connectionType';
import FormTextInput from './FormTextInput';

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

  const clearInput = () => {
    setName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!firstName || !lastName || !email || !password) {
        Alert.alert('Error', 'Por favor  complete el formulario primero.');
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

      if (response.detail){
        Alert.alert('Error', response.detail)
        clearInput();
        return;
      }

    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>
      <Text style={styles.subtitleInstruction}>
        Utiliza (
        <Image
          source={require('../assets/send-message-button.png')}
          style={styles.sendButton}
          resizeMode="contain"
        />
        ) para guardar tus datos.
      </Text>
      {!firstName ? (
        <FormTextInput
          placeholder="Nombre"
          secureTextEntry={false}
          set={setName}
        />
      ) : (
        <Text style={styles.subtitle}>• Nombre/s:    {firstName} </Text>
      )}
      {!lastName ? (
        <FormTextInput
          placeholder="Apellido"
          secureTextEntry={false}
          set={setLastName}
        />
      ) : (
        <Text style={styles.subtitle}>• Apellido/s:   {lastName}</Text>
      )}
      {!email ? (
        <FormTextInput
          placeholder="email"
          secureTextEntry={false}
          set={setEmail}
        />
      ) : (
        <Text style={styles.subtitle}>• Email:            {email}</Text>
      )}
      {!password ? (
        <FormTextInput
          placeholder="Contraseña"
          secureTextEntry={true}
          set={setPassword}
        />
      ) : (
        <Text style={styles.subtitle}>---------contraseña valida  ✅---------</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.buttonText}>Registrar Huella</Text>
        <Image
          source={require('../assets/fingerprint.png')}
          style={styles.fingerprintIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.buttonText}>Capturar Rostro </Text>
        <Image
          source={require('../assets/face.png')}
          style={styles.fingerprintIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '50%',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3369FF',
    marginBottom: 0 ,
  },
  subtitleInstruction:{
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 40,
    marginLeft: 30,
  },
  subtitle: {
    fontSize: 15,

    marginBottom: 20,
    marginLeft: 30,
    textAlign: 'left',
  },
  button: {
    alignSelf:'center',
    backgroundColor: '#3369FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: '70%',
    marginTop: 20,
    maxWidth: 330,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#3369FF',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fingerprintIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  sendButton: {
    width: 18,
  },
});

export default Signup;
