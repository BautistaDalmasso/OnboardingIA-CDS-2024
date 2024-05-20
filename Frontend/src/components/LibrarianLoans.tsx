import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { RequestedLoansService } from "../services/requestedLoansService";
import { ILoanInformationResponse } from "../common/interfaces/LoanReqResponse";
import SearchBarComponent from "./SearchBar";

const LibrarianLoans = () => {
    const [loans, setLoans] = useState<ILoanInformationResponse[]>([]);
    const [search, setSearch] = useState("");
    const [searchPicker, setSearchPicker] = useState("user_email");
    const [pickerItems, setPickerItems ] = useState< {label: string ; value: string }[]>([]);

    useEffect(() => {
      const fetchBooks = async () => {
        try {
          const loans = await RequestedLoansService.getAllLoans();
          setLoans(loans);
          setPickerItems( [
            { label: "E-mail del usuario", value: "user_email" },
            { label: "Título del libro", value: "title" },
          ]);
        } catch (error) {
          console.error("An error occurred, loans could not be retrieved:", error);
        }
      };

      fetchBooks();
    }, []);

    const filteredLoans = loans.filter((loan) => {
      switch (searchPicker) {
        case "title":
          return loan.title.toLowerCase().includes(search.toLowerCase());
        case "user_email":
          return loan.user_email.toLowerCase().includes(search.toLowerCase());
        default:
          return false;
      }
    });

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Lista de Prestamos</Text>
        <SearchBarComponent
          pickerItems={pickerItems}
          search={search}
          setSearch={setSearch}
          searchPicker={searchPicker}
          setSearchPicker={setSearchPicker}

        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredLoans.map((Loan) => (
            <View key={Loan.id} style={styles.bookContainer}>
              <Text style={styles.bookTitle}>{Loan.title}</Text>
              <Text style={styles.bookTitle}>{Loan.user_email}</Text>
              <Text style={styles.cardLevel}>
                Vencimiento: {new Date(Loan.expiration_date).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </ScrollView>
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
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      marginTop: 30,
      textAlign: "center",
    },
    bookContainer: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 20,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    bookTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    cardLevel: {
      fontSize: 16,
      marginBottom: 10,
    },
    button: {
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
    scrollContent: {
      paddingBottom: 200,
    },
  });

  export default LibrarianLoans;
