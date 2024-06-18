import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useContextState } from "../../ContexState";
import usePointsExchange from "../../hooks/usePointsExchange";
import PointExchangeOption from "./PointExchangeOption";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const image = require("../../assets/header.png");
const PointsExchange = () => {
  const { contextState } = useContextState();
  const { exchangeForTrustedLicence, exchangeForIncreaseLimit } = usePointsExchange();

  if (contextState.user === null) {
    return (
      <View style={styles.container}>
        <Text>Usuario no está logueado</Text>
      </View>
    );
  }

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.titleHeader}>Intercambio de Puntos</Text>
        </ImageBackground>
      </View>
      <View style={styles.containerPoints}>

        <Text style={styles.pointsText}>
          Tus Puntos: {contextState.user.points}
        </Text>
      </View>
      <View style={styles.optionsContainer}>
        <PointExchangeOption
          optionName={"Obtener Carnet Nivel Confiado"}
          pointsCost={1000}
          onExchange={async () => {
            await exchangeForTrustedLicence();
          }}
          disabled={(contextState.user.licenceLevel as number) >= 2}
        />
        <PointExchangeOption
          optionName={"Aumentar limite de reservas"}
          pointsCost={100}
          onExchange={async () => {
            await exchangeForIncreaseLimit();
          }}
          disabled={(contextState.user.licenceLevel as number) >= 2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.4,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  titleHeader: {
    height: hp('18%'),
    width: wp('100%'),
    fontSize: hp('3.4%'),
    textAlign: "center",
    color: "#006694",
    textShadowRadius: 30,
    textShadowColor: "#42FFD3",
    fontWeight: "bold",
  },
  containerPoints: {
    flex:0.1,
  },
  pointsText: {
    fontSize: hp('3%'),
    fontWeight: "bold",
    alignSelf: "center",
    color: "#006694",
  },

  optionsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default PointsExchange;
