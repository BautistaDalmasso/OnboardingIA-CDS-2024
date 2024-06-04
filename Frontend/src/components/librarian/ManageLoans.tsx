import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ScanReturnedBook from "./BarcodeScanningScreens/ScanReturnedBook";
import { useFocusEffect } from "@react-navigation/native";
import ScanForLoan from "./BarcodeScanningScreens/ScanForLoan";

const ManageLoans = () => {
  const [scanningReturnedBook, setScanningReturnedBook] = useState(false);
  const [scanningForLoan, setScanningForLoan] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setScanningReturnedBook(false);
      setScanningForLoan(false);

      return () => {};
    }, []),
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
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de prestamo</Text>

      <TouchableOpacity onPress={() => setScanningReturnedBook(true)}>
        <Text>Escanear libro devuelto.</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScanningForLoan(true)}>
        <Text>Escanear QR y Libro para préstamo.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  containerData: {
    flexGrow: 1,
    backgroundColor: "white",
    padding: 10,

    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    marginTop: 8,
    backgroundColor: "#F3F3F3",
    width: "100%",
  },
  containerChanges: {
    flexGrow: 0.4,
    backgroundColor: "white",
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    marginTop: 10,
    backgroundColor: "#F3F3F3",
    height: 50,
    fontSize: 17,
    fontWeight: "500",
    color: "#111827cc",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  button: {
    marginTop: 50,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  text: {
    marginTop: 6,
    fontSize: 18,
  },
  placeholderContainer: {
    height: 200,
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  text1: {
    marginVertical: 15,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  due: {
    flex: 1,
    marginVertical: 10,
    flexDirection: "column",
  },
});

export default ManageLoans;
