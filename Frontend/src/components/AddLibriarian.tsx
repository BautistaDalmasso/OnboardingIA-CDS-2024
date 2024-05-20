import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useContextState } from "../ContexState";
import { IUser } from "../common/interfaces/User";
import { UserService } from "../services/userService";

const AddLibrarian = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { contextState } = useContextState();
  const [requestedButtons, setRequestedButtons] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers(currentPage);
        setUsers(data);

        const librarianEmails = data
          .filter((user) => user.role !== "basic")
          .map((user) => user.email);
        setRequestedButtons(librarianEmails);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleAddLibrarian = async (user: IUser) => {
    try {
      const response = await UserService.addLibrarian(
        user.email,
        contextState.accessToken as string,
      );
      if (response.role !== "basic") {
        setRequestedButtons([...requestedButtons, user.email]);
        Alert.alert(`Bibliotecario ${user.email} agregado con éxito`);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(`${error}`);
    }
  };

  const handleDeleteLibrarian = async (user: IUser) => {
    try {
      const response = await UserService.deleteLibrarian(
        user.email,
        contextState.accessToken as string,
      );
      if (response.role === "basic") {
        setRequestedButtons([...requestedButtons, user.email]);
        Alert.alert(`Bibliotecario ${user.email} eliminado con éxito`);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(`${error}`);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuarios</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {users.map((user) => (
          <View key={user.email} style={styles.bookContainer}>
            <Text style={styles.bookTitle}>
              {user.firstName.toUpperCase() + " " + user.lastName.toUpperCase()}
            </Text>
            <Text style={styles.cardLevel}>Email: {user.email}</Text>
            <Text style={styles.cardLevel}>{user.role?.toUpperCase()}</Text>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: requestedButtons.includes(user.email)
                    ? "red"
                    : "#007bff",
                },
              ]}
              onPress={() =>
                user.role !== "basic"
                  ? handleDeleteLibrarian(user)
                  : handleAddLibrarian(user)
              }
            >
              <Text style={styles.buttonText}>
                {requestedButtons.includes(user.email)
                  ? "Bibliotecario"
                  : "Agregar"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pageContainer}>
        <TouchableOpacity
          style={styles.pageButton}
          onPress={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <Text style={styles.pageButtonText}>{"<<"} Página anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pageButton} onPress={goToNextPage}>
          <Text style={styles.pageButtonText}>Siguiente página {">>"}</Text>
        </TouchableOpacity>
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
    position: "relative",
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
  pageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  pageButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  pageButtonText: {
    color: "#000",
  },
});

export default AddLibrarian;
