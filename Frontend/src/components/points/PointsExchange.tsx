import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useContextState } from "../../ContexState";
import usePointsExchange from "../../hooks/usePointsExchange";
import PointExchangeOption from "./PointExchangeOption";

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
        <Text style={styles.title}>Intercambio de Puntos</Text>
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
          optionName={"Solicitar más Libros"}
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
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingLeft: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default PointsExchange;
