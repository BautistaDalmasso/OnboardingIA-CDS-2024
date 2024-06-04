import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RequestedLoansService } from "../../services/requestedLoansService";
import { ILoanInformation } from "../../common/interfaces/LoanReqResponse";
import SearchBarComponent from "../common/SearchBar";
import { useContextState } from "../../ContexState";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";

interface Props {
  navigation: NavigationProp<any, any>;
}

const LibrarianLoans = ({ navigation }: Props) => {
  const { contextState } = useContextState();
  const [loans, setLoans] = useState<ILoanInformation[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterCategory, setFilterCategory] = useState("user_email");
  const [pickerItems, setPickerItems] = useState<
    { label: string; value: string }[]
  >([]);
  const [showAlert, setShowAlert] = useState(false);

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
      console.error("An error occurred, loans could not be retrieved:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setSearchValue("");
      setLoans([]);
      fetchLoans();
      setPickerItems([]);
      fetchLoans();
      setShowAlert(false);
      return () => {};
    }, []),
  );

  useEffect(() => {
    setLoans([]);
  }, []);

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

  function checkStatus(status: string) {
    switch (status) {
      case "reserved":
        return "Reservado";
      case "loaned":
        return "Prestado";
      case "reservation_canceled":
        return "Reservación cancelada";
      case "loan_return_overdue":
        return "Devolución demorada";
      case "returned":
        return "Devuelto";
      default:
        return "Unknown status";
    }
  }

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
      <Text style={styles.indications}>
        Seleccione el préstamo que desea gestionar:{" "}
      </Text>
      {showAlert && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            No se encontraron préstamos para la búsqueda realizada.
          </Text>
        </View>
      )}
      <View style={styles.containerScroll}>
        <ScrollView>
          {loans.map((Loan) => (
            <TouchableOpacity
              key={Loan.inventory_number}
              onPress={() =>
                navigation.navigate("Gestion de prestamos", { loan: Loan })
              }
            >
              <View style={styles.bookContainer} key={Loan.inventory_number}>
                <Text style={styles.bookTitle}>Préstamo id: {Loan.id}</Text>
                <Text style={styles.bookTitle}>Usuario: {Loan.user_email}</Text>
                <Text style={styles.cardLevel}>
                  Libro: {Loan.catalogue_data.title}
                </Text>
                <Text style={styles.cardLevel}>
                  Estado: {checkStatus(Loan.loan_status)}
                </Text>

                <Text style={styles.cardLevel}>
                  Vencimiento:{" "}
                  {new Date(Loan.expiration_date).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
  containerScroll: {
    flexGrow: 1,
    overflow: "hidden",
    height: 400,
  },
  indications: {
    textAlign: "center",
    fontWeight: "bold",
    margin: 20,
    fontSize: 15,
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
    width: "100%",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    flexGrow: 1,
    flexShrink: 1,
  },
  cardLevel: {
    fontSize: 16,
    marginBottom: 10,
    flexGrow: 1,
    flexShrink: 1,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 260,
  },
});

export default LibrarianLoans;
