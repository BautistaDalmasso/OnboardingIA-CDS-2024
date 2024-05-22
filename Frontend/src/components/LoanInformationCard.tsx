import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import convertLoanStatusToString from "../common/enums/loanStatus";
import { ILoanInformation } from "../common/interfaces/LoanReqResponse";
import LinkButton from "./LinkButton";

interface LoanInformationCardProps {
  loan: ILoanInformation;
}

const LoanInformationCard: React.FC<LoanInformationCardProps> = ({
  loan,
}: LoanInformationCardProps) => {
  useEffect(() => {
    console.log(loan);
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{loan.catalogue_data.title}</Text>
      </View>

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>ISBN:</Text>
        <Text style={styles.isbn}> {loan.catalogue_data.isbn} </Text>
      </View>

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Clasificación CDD:</Text>
        <Text style={styles.ddcClass}> {loan.catalogue_data.ddc_class} </Text>
        <LinkButton
          text="(?)"
          onPress={() =>
            Alert.alert(
              "Clasificación Decimal de Dewey",
              "Las Secciones y Estanterías de nuestra biblioteca están ordenadas según este código." +
                " Podés utilizarlo para localizar el libro que buscás.",
            )
          }
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>
          Vencimiento: {new Date(loan.expiration_date).toLocaleDateString()}
        </Text>
        <Text style={styles.detail}>
          Estado: {convertLoanStatusToString(loan.loan_status)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    width: 350,
    height: 170,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    padding: 16,
    marginVertical: 8,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    marginStart: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#006691",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  detail: {
    fontSize: 17,
    color: "#006695",
  },
  mixedTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  isbn: {
    fontSize: 16,
    marginTop: 10,
  },
  ddcClass: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default LoanInformationCard;
