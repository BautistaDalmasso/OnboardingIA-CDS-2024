import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import BookCard from "./BookCard";
import { RequestedLoansService } from "../services/requestedLoansService";
import { useContextState } from "../ContexState";
import { ILoanInformationResponse } from "../common/interfaces/LoanReqResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Loan {
  isbn: string;
  title: string;
  copyID: string;
  expirationDate: Date;
}

const image = require("../assets/background.png");

const MyLoans = () => {
  const { contextState } = useContextState();
  const [bookList, setBookList] = useState<ILoanInformationResponse[]>([]);

  const fetchLoans = async () => {
    try {
      if (contextState.user === null) {
        throw Error("No connected user.");
      }

      const loans = await RequestedLoansService.getLoansByEmail(
        contextState.user.email,
        contextState.accessToken as string,
      );

      setBookList(loans);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  const loadBooksFromAsyncStorage = async () => {
    try {
      const jsonData = await AsyncStorage.getItem("Loans");
      if (!jsonData) {
        console.log("No hay datos guardados en AsyncStorage.");
        return;
      }

      const data = JSON.parse(jsonData);
      setBookList(data);
    } catch (error) {
      console.error("Error al cargar los datos desde AsyncStorage:", error);
    }
  };

  useEffect(() => {
    if (contextState.isConnected) {
      fetchLoans();
    } else {
      loadBooksFromAsyncStorage();
    }
  }, [contextState.isConnected]);

  return (
    <View style={styles.container1}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.title}>Prestamos solicitadados</Text>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {bookList.map((book) => (
              <BookCard
                key={book.inventory_number}
                title={book.title}
                dueDate={book.expiration_date}
              />
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
