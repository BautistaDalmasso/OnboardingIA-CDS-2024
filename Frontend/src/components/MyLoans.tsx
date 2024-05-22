import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import LoanInformationCard from "./LoanInformationCard";
import { useContextState } from "../ContexState";

const image = require("../assets/background.png");

const MyLoans = () => {
  const { contextState } = useContextState();

  return (
    <View style={styles.container1}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.title}>Prestamos solicitadados</Text>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {contextState.loans.map((loan) => (
              <LoanInformationCard key={loan.inventory_number} loan={loan} />
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  scrollViewContainer: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    height: 70,
    fontSize: 22,
    textAlign: "center",
    color: "#006694",
    textShadowRadius: 30,
    textShadowColor: "#42FFD3",
    textAlignVertical: "center",
    marginVertical: 20,
    marginStart: 30,
    fontWeight: "bold",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});

export default MyLoans;
