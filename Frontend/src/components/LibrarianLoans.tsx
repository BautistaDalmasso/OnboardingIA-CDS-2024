import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { RequestedLoansService } from "../services/requestedLoansService";
import { ILoanInformation } from "../common/interfaces/LoanReqResponse";
import SearchBarComponent from "./SearchBar";
import { useContextState } from "../ContexState";

const LibrarianLoans = () => {
  const { contextState } = useContextState();
  const [loans, setLoans] = useState<ILoanInformation[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterCategory, setFilterCategory] = useState("user_email");
  const [pickerItems, setPickerItems] = useState<
    { label: string; value: string }[]
  >([]);
  const [requestedButton, setRequestedButton] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loans = await RequestedLoansService.getAllLoans(
          contextState.accessToken as string,
        );
        setLoans(loans);

        setPickerItems([
          { label: "Buscar por E-mail", value: "user_email" },
          { label: "Bucar por Título", value: "title" },
        ]);
      } catch (error) {
        console.error(
          "An error occurred, loans could not be retrieved:",
          error,
        );
      }
    };

    fetchLoans();
  }, []);

  const [fetchLoans, setFetchLoans] = useState(() => async () => {
    try {
      const loans = await RequestedLoansService.getAllLoans(
        contextState.accessToken as string,
      );
      setLoans(loans);
      setShowAlert(false);
      setSearchValue("");
      setPickerItems([
        { label: "Buscar por E-mail", value: "user_email" },
        { label: "Bucar por Título", value: "title" },
      ]);
    } catch (error) {
      console.error("An error occurred, loans could not be retrieved:", error);
    }
  });

  const clearLoans = () => {
    fetchLoans();
  };

  const conductSearch = async () => {
    try {
      let loans: ILoanInformation[] = [];

      if (filterCategory === "user_email") {
        loans = await conductSearchByEmail();
      } else if (filterCategory === "title") {
        loans = await conductSearchByTitle();
      }
      if (loans.length === 0) {
        setShowAlert(true);
      }
      setLoans(loans);
    } catch (error) {
      console.error("Error al obtener Prestamos:", error);
    }
  };

  const conductSearchByEmail = async () => {
    return await RequestedLoansService.getLoansByEmail(
      searchValue,
      contextState.accessToken as string,
    );
  };
  const conductSearchByTitle = async () => {
    return await RequestedLoansService.getLoansByTitle(
      searchValue,
      contextState.accessToken as string,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Prestamos</Text>
      <SearchBarComponent
        pickerItems={pickerItems}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        onSearch={conductSearch}
        onClear={clearLoans}
      />
      {showAlert && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            No se encontraron préstamos para la búsqueda realizada.
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loans.map((Loan) => (
          <View style={styles.bookContainer} key={Loan.id}>
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
  alertContainer: {
    backgroundColor: "red",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  alertText: {
    color: "white",
    fontWeight: "bold",
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
