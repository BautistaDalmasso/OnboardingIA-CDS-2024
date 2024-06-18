import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import usePointsExchange from "../../hooks/usePointsExchange";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface PointExchangeOptionProps {
  optionName: string;
  optionDescription?: string;
  pointsCost: number;
  onExchange: () => void;
  disabled?: boolean;
}

const PointExchangeOption = ({
  optionName,
  optionDescription,
  pointsCost,
  onExchange,
  disabled,
}: PointExchangeOptionProps) => {
  const { hasEnoughPoints } = usePointsExchange();

  const isDisabled = () => {
    return disabled === undefined
      ? !hasEnoughPoints(pointsCost)
      : disabled || !hasEnoughPoints(pointsCost);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{optionName}</Text>
      </View>

      {optionDescription && (
        <View style={styles.mixedTextContainer}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.detail}> {optionDescription} </Text>
        </View>
      )}

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Costo:</Text>
        <Text style={styles.detail}> {pointsCost} </Text>
      </View>

      <TouchableOpacity
        style={isDisabled() ? styles.buttonDisabled : styles.button}
        onPress={onExchange}
        disabled={isDisabled()}
      >
        <Text
          style={isDisabled() ? styles.buttonDisabledText : styles.buttonText}
        >
          Canjear
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: hp('13%'),
    width: wp('90%'),
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 16,
    marginVertical: hp('3%'),
    alignSelf: "center",
  },
  titleContainer: {
    marginBottom:  hp('3%'),
  },
  title: {
    fontSize:  hp('2.5%'),
    fontWeight: "bold",
    color: "#006694"
  },
  detail: {
    fontSize: hp('2.5%'),
    color: "#000",
  },
  mixedTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: hp('1%') ,
  },
  label: {
    fontSize: hp('2.5%'),
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    marginTop: hp('2%'),
    backgroundColor: "#006691",
    fontSize: hp('2.5%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: hp('2.5%'),
    fontWeight: "bold",
  },
  buttonDisabled: {
    marginTop: hp('2%'),
    backgroundColor: "#a1a1a1",
    fontSize: hp('2.5%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabledText: {
    color: "#d3d3d3",
    fontSize: hp('2.5%'),
    fontWeight: "bold",
  },
});

export default PointExchangeOption;
