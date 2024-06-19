import React, { useState } from "react";
import CustomTextInput from "../../common/CustomTextInput";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AntDesign } from '@expo/vector-icons';

interface SelectUserProps {
  inputValue: string;
  onPressSearch: (userEmail: string) => void;
  onPressScanQr: () => void;
}

const SelectUser = ({ onPressSearch, onPressScanQr }: SelectUserProps) => {
  const [userEmail, setUserEmail] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setUserEmail("")
      };
    }, []),
  );

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
        <AntDesign name="user" size={wp('8%')} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonQR} onPress={onPressScanQr}>
        <Text style={styles.buttonText}>Escanear QR</Text>
        <AntDesign name="qrcode" size={wp('8%')} color="white" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  instruction: {
    bottom: wp('5%'),
    marginBottom: 5,
    marginTop: hp('7%'),
    fontSize: wp('4.5%'),
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
  buttonQR: {
    backgroundColor: "#48bce4",
    paddingVertical: wp('3%'),
    borderRadius: 100,
    width: wp('80%'),
    marginTop: wp('10%'),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectUser;
