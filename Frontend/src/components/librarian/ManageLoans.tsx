import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ScanReturnedBook from "./BarcodeScanningScreens/ScanReturnedBook";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import ScanForLoan from "./BarcodeScanningScreens/ScanForLoan";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Routes } from "../../common/enums/routes";

interface Props {
  navigation: NavigationProp<any, any>;
}
const image = require("../../assets/headerLicence.png");

const ManageLoans = ({ navigation: navigator }: Props) => {
  const [scanningReturnedBook, setScanningReturnedBook] = useState(false);
  const [scanningForLoan, setScanningForLoan] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setScanningReturnedBook(false);
      setScanningForLoan(false);

      return () => { };
    }, [])
  );

  if (scanningReturnedBook) {
    return (
      <ScanReturnedBook
        onBookReturnFinished={() => setScanningReturnedBook(false)}
      />
    );
  }

  if (scanningForLoan) {
    return <ScanForLoan onBookLoanFinished={() => setScanningForLoan(false)} />;
  }

  return (
    <View style={styles.screenContainer}>
    <View style={styles.headerContainer}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <Text style={styles.titleHeader}>Gestión de Préstamo</Text>
      </ImageBackground>
    </View>
    <View style={styles.contentContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanningReturnedBook(true)}
        >
          <Text style={styles.buttonText}>Escanear Libro Devuelto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanningForLoan(true)}
        >
          <Text style={styles.buttonText}>
            Escanear QR y Libro para Préstamo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigator.navigate(Routes.AssignLoanManually)}
        >
          <Text style={styles.buttonText}>Asignar Préstamo manualmente</Text>
          <Text style={styles.buttonSubText}>
            (Ingresando email y Nro. de Inventario)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    height: hp('100%'),
    width: wp('100%'),
    flex: 1,
  },
  headerContainer:{
      height: hp('25%'),
      width: wp('100%'),
  },
  titleHeader: {
    fontSize:hp('3.5%'),
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#056D8D",
    height: hp('15%'),
    width: wp('100%'),
    textAlign: "center",
    textShadowRadius: 30,
    textShadowColor: "#42FFD3",
    textAlignVertical: "top",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent:"flex-start",
    alignItems: "flex-start",
    marginTop: hp('4.5%'),
    paddingHorizontal: 20,
  },

  button: {
    backgroundColor: "#056D8D",
    borderRadius: 5,
    padding: 15,
    marginHorizontal: hp('1%'),
    marginVertical: hp('2.5%'),
  },
  buttonText: {
    color: "#fff",
    fontSize: hp('2.2%'),
    textAlign: "center",
  },
  buttonSubText: {
    color: "#fff",
    fontSize: hp('1.5%'),
    textAlign: "center",
  },
});

export default ManageLoans;
