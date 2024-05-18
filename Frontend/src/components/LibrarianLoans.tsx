import React, {
  useEffect,
  useState
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RequestedLoansService } from "../services/requestedLoansService";
import { useContextState } from "../ContexState";
import { ILoanInformationResponse } from "../common/interfaces/LoanReqResponse";

const LibrarianLoans = () => {
  const { contextState } = useContextState();
  const [loansList, setLoansList] = useState<ILoanInformationResponse[]>([]);

  const fetchLoans = async () => {
    try {
      if (contextState.user === null) {
        throw Error("No connected user.");
      }

      const loans = await RequestedLoansService.getAllLoans();
      setLoansList(loans);

    } catch (error) {
      console.error("Error al obtener los prestamos:", error);
    }
  };

  useEffect(() => {
      fetchLoans();
  }, [contextState.isConnected]);

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Prestamos de usuarios</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {loansList.map((book) => (
              <View key={book.id} style={styles.bookContainer}>
                <Text style={styles.bookTitle}>Título: {book.title} </Text>
                <Text style={styles.bookTitle}>Usuario: {book.user_email}</Text>
                <Text style={styles.cardLevel}>Vencimiento: {new Date(book.expiration_date).toLocaleDateString()}</Text>
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
  scrollContent: {
    paddingBottom: 200,
  },
});

  export default LibrarianLoans;
