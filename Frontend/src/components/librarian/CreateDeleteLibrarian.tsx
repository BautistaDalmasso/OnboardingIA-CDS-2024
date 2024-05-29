import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useContextState } from "../../ContexState";
import { IUser } from "../../common/interfaces/User";
import { UserRole } from "../../common/enums/user";
import { Picker } from "@react-native-picker/picker";
import { SearchBar } from "@rneui/themed";
import { librarianServiceCD } from "../../services/librarianCDService";
import Pagination from "../../common/interfaces/Pagination";
import usePagination from "../../hooks/usePagination";

//TODO: update the search bar and adapt it to the one currently being used if it's necessary.
const CDLibrarian = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { contextState } = useContextState();
  const [requestedButtons, setRequestedButtons] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState(UserRole.BASIC);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    setShowNextPage,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage,
    currentPage,
    showNextPage,
  } = usePagination();

  const fetchUsers = async () => {
    try {
      const data = await librarianServiceCD.getUsersByRole(
        selectedRole,
        currentPage,
      );
      setShowNextPage(false);
      if (data.length > 0) {
        setUsers(data);

        const librarianEmails = data
          .filter((user) => user.role !== UserRole.BASIC)
          .map((user) => user.email);
        setRequestedButtons(librarianEmails);
      } else {
        setShowNextPage(true);
      }
    } catch (error) {
      setUsers([]);
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleAddLibrarian = async (user: IUser) => {
    try {
      const response = await librarianServiceCD.addLibrarian(
        user.email,
        contextState.accessToken as string,
      );
      if (response.role !== UserRole.BASIC) {
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
      const response = await librarianServiceCD.deleteLibrarian(
        user.email,
        contextState.accessToken as string,
      );
      if (response.role === UserRole.BASIC) {
        setRequestedButtons(
          requestedButtons.filter((email) => email !== user.email),
        );
        Alert.alert(`Bibliotecario ${user.email} eliminado con éxito`);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(`${error}`);
    }
  };

  const filteredUsers = () => {
    return users.filter(
      (user) =>
        user.role === selectedRole &&
        user.email.includes(searchTerm.toLowerCase()),
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    fetchUsers();
  }, [selectedRole]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuarios</Text>
      <Picker
        selectedValue={selectedRole}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRole(itemValue)}
      >
        <Picker.Item label="Básico" value={UserRole.BASIC} />
        <Picker.Item label="Bibliotecario" value={UserRole.LIBRARIAN} />
      </Picker>
      <SearchBar
        placeholder="Buscar por email"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredUsers().map((user) => (
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
                    ? "#0047ab"
                    : "#007bff",
                },
              ]}
              onPress={() =>
                requestedButtons.includes(user.email)
                  ? handleDeleteLibrarian(user)
                  : handleAddLibrarian(user)
              }
            >
              <Text style={styles.buttonText}>
                {requestedButtons.includes(user.email)
                  ? "Cambiar a básico"
                  : "Cambiar a bibliotecario"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Pagination
        currentPage={currentPage}
        showNextPage={showNextPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
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
    paddingBottom: 50,
  },
  picker: {
    backgroundColor: "#fff",
    height: 50,
    width: "auto",
    alignSelf: "stretch",
    marginBottom: 0,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  searchBarInputContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});

export default CDLibrarian;
