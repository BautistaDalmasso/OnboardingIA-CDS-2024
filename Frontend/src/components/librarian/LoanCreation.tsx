import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useLoanCreation from "../../hooks/useLoanCreation";
import SearchBarComponent from "../book-catalogue/BooksSearchBar";
import { IBookWithLicence } from "../../common/interfaces/Book";
import { LibraryService } from "../../services/LibraryService";
import BookListAssignLoan from "../book-catalogue/BookListAssignLoan";
import { useContextState } from "../../ContexState";

enum pages {
  CHECK_USER = 0,
  SHOW_OPTIONS = 1,
  ENTER_INVENTORY_NUMBER = 2,
  SEARCH_BOOK_TO_LOAN = 3,
}

const LoanCreation = () => {
  const [books, setBooks] = useState<IBookWithLicence[]>([]);

  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [inventoryNumber, setInventoryNumber] = useState(0);
  const { assignLoan, assignLoanBook, checkUser } = useLoanCreation();
  const [firstName, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [licence, setLicence] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filterCategory, setFilterCategory] = useState("title");
  const { contextState } = useContextState();
  const [showUser, setShowUser] = useState(false);

  /*this function is used to return the screen to its original state, in case the user exits the screen */
  useFocusEffect(
    React.useCallback(() => {
      setEmail("");
      setShowUser(false);
      handleChangePage(pages.CHECK_USER);

      return () => {};
    }, []),
  );

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChangePage = (pageIndex: number) => {
    scrollViewRef.current?.scrollTo({
      y: pageIndex * Dimensions.get("window").height,
      animated: true,
    });
  };

  const conductSearchByIsbn = async () => {
    return await LibraryService.getBookByISBN(searchValue);
  };

  const conductSearchByFilter = async () => {
    return await LibraryService.getFilteredBooks(filterCategory, searchValue);
  };

  const conductSearch = async () => {
    try {
      let books: IBookWithLicence[] = [];

      if (filterCategory === "isbn") {
        books = await conductSearchByIsbn();
      } else {
        books = await conductSearchByFilter();
      }

      setBooks(books);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await assignLoan(inventoryNumber, email);
    } catch (error) {
      console.error("Error en asignar prestamo:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const books = await LibraryService.getBooks();
      setBooks(books);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  const handleSubmitConsultUser = async () => {
    try {
      setLoading(true);

      const user = await checkUser(email);
      if (user == null) {
        return;
      }
      setLastName(!user ? "no es usuario" : user.lastName.toUpperCase());
      setName(!user ? "no es usuario" : user.firstName.toUpperCase());

      if (user?.licenceLevel === 1) {
        setLicence("REGULAR");
      }
      if (user?.licenceLevel === 2) {
        setLicence("CONFIADO");
      }
      if (user?.licenceLevel === 3) {
        setLicence("INVESTIGADOR");
      }
      setShowUser(true);
      handleChangePage(pages.SHOW_OPTIONS);
    } catch (error) {
      console.error("Error in:", error);
    } finally {
      setLoading(false);
    }
  };

  const isBookLoaned = (isbn: string) => {
    return contextState.loans.some((loan) => loan.catalogue_data.isbn === isbn);
  };

  const conductSearchByButton = async (
    filterCategory: string,
    searchValue: string,
  ) => {
    try {
      const books = await LibraryService.getFilteredBooks(
        filterCategory,
        searchValue,
      );

      setBooks(books);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asignación de Prestamo</Text>

      {showUser && (
        <View style={styles.bookContainer}>
          <Text style={styles.bookTitle}>
            {"Usuario: " + firstName + " " + lastName}
          </Text>
          <Text style={styles.cardLevel}>Email: {email}</Text>
          <Text style={styles.cardLevel}>Carnet: {licence}</Text>
        </View>
      )}
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled={false}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <View key={pages.CHECK_USER} style={styles.page}>
          <Text style={styles.instruction}>
            Confirmar prestamo de un libro para el usuario del email indicado:{" "}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ingresar email de usuario ..."
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          ></TextInput>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmitConsultUser}
            disabled={loading}
          >
            <Text style={styles.buttonText}> verificar usuario</Text>
          </TouchableOpacity>
        </View>
        <View key={pages.SHOW_OPTIONS} style={styles.page}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChangePage(pages.ENTER_INVENTORY_NUMBER)}
            disabled={loading}
          >
            <Text style={styles.buttonText}> Ingresar Nro. de inventario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChangePage(pages.SEARCH_BOOK_TO_LOAN)}
            disabled={loading}
          >
            <Text style={styles.buttonText}> Buscar libro</Text>
          </TouchableOpacity>
        </View>
        <View key={pages.ENTER_INVENTORY_NUMBER} style={styles.page}>
          <Text style={styles.instruction}>
            Ingrese el número de inventario de un libro:{" "}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Escriba el número aquí..."
            keyboardType="numeric"
            maxLength={13}
            value={inventoryNumber === 0 ? "" : inventoryNumber.toString()}
            onChangeText={(text) => setInventoryNumber(Number(text))}
          ></TextInput>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}> Asignar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChangePage(pages.SHOW_OPTIONS)}
          >
            <Text style={styles.link}> {"volver atras >>"}</Text>
          </TouchableOpacity>
        </View>
        <View key={pages.SEARCH_BOOK_TO_LOAN} style={styles.page}>
          <Text style={styles.instruction}>
            Seleccione el libro a prestar:{" "}
          </Text>
          <View style={styles.containerSearch}>
            <SearchBarComponent
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              onSearch={conductSearch}
              onClear={fetchBooks}
            />
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {books.map((book) => (
              <View style={styles.bookContainer} key={book.book_data.isbn}>
                <BookListAssignLoan
                  book={book}
                  isBookLoaned={isBookLoaned}
                  handleLoanConfirmed={() =>
                    assignLoanBook(email, book.book_data.isbn)
                  }
                  handleButtonSearch={conductSearchByButton}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#48bce4",
    textAlign: "center",
    bottom: 15,
  },
  instruction: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#E6E6E6",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 15,
    maxWidth: 330,
  },
  button: {
    backgroundColor: "#3369FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "100%",
    marginTop: 20,
    maxWidth: 330,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  bookContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginTop: 1,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardLevel: {
    fontSize: 14,
    marginBottom: 5,
  },
  pageContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginVertical: "auto",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  page: {
    height: Dimensions.get("window").height,
    width: "100%",
    paddingHorizontal: 10,
  },
  containerSearch: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  link: {
    color: "blue",
    alignSelf: "center",
    margin: 20,
  },
});
export default LoanCreation;
