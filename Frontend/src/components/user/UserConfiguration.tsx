import { NavigationProp } from "@react-navigation/native";
import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { UserService } from "../../services/userService";
import { useContextState } from "../../ContexState";
import useBiometrics from "../../hooks/useBiometrics";
import { generateKeyPair } from "../../common/utils/crypto";
import React, { useState } from "react";
import { Routes } from "../../common/enums/routes";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface Props {
  navigation: NavigationProp<any, any>;
}

const UserConfiguration = ({ navigation }: Props) => {
  const { contextState } = useContextState();
  const { authenticate } = useBiometrics();
  const [loading, setLoading] = useState(false);

  const handleFingerprintRegistration = async () => {
    setLoading(true);

    if (contextState.accessToken === null) {
      throw Error("User not correctly logged in.");
    }
    if (contextState.user === null) {
      throw Error("User not correctly logged in.");
    }

    const successBiometric = await authenticate();
    if (!successBiometric) {
      Alert.alert("Error", "Autenticación fallida");
      return;
    }

    const { privateKey, publicKey } = generateKeyPair();

    await UserService.updatePublicKey(
      JSON.stringify(publicKey),
      contextState.accessToken,
      contextState.user?.email,
    );

    await SecureStore.setItemAsync("privateKey", JSON.stringify(privateKey));

    Alert.alert("Huella registrada para este dispositivo!");

    setLoading(false);
  };

  function handleRegisterFace() {
    navigation.navigate(Routes.RegisterFace);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleFingerprintRegistration}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Registrar Huella</Text>
        <Image
          source={require("../../assets/fingerprint.png")}
          style={styles.fingerprintIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleFingerprintRegistration}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Registrar Rostro</Text>
        <Image
          source={require("../../assets/face.png")}
          style={styles.fingerprintIcon}
          tintColor={"white"}
          resizeMode="contain"
        />
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
  button: {
    backgroundColor: "#006694",
    paddingVertical: wp('3%'),
    borderRadius: 100,
    width: wp('80%'),
    marginTop: wp('10%'),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: hp('2%'),
    fontWeight: "bold",
    marginRight: wp('8%'),
  },
  fingerprintIcon: {
    height:hp('4%'),
    width:wp('8%'),
  },
});

export default UserConfiguration;
