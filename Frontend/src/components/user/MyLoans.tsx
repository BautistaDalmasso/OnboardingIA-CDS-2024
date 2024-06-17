import React from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import LoanInformationCard from "../common/loan/LoanInformationCard";
import { useContextState } from "../../ContexState";

const image = require("../../assets/header.png");

const MyLoans = () => {
  const { contextState } = useContextState();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.titleHeader}>Prestamos solicitadados</Text>
        </ImageBackground>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {contextState.loans.map((loan) => (
          <LoanInformationCard key={loan.inventory_number} loan={loan} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  header: {
    flex: 0.3,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  titleHeader: {
    height: hp('15%'),
    width: wp('100%'),
    fontSize: hp('3%'),
    textAlign: "center",
    color: "#006694",
    textShadowRadius: 30,
    textShadowColor: "#42FFD3",
    textAlignVertical: "top",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollViewContainer: {
    width: wp('100%'),
    alignItems: "center",
  },

});

export default MyLoans;
