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
import { UserRole } from "../common/enums/user";
import { Picker } from "@react-native-picker/picker";
import { SearchBar } from "@rneui/themed";
import { ShowUserPage } from "../common/enums/Page";
import { librarianServiceCD } from "../services/librarianCDService";

//TODO: update the search bar and adapt it to the one currently being used if it's necessary.
const AddLibrarian = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { contextState } = useContextState();
  const [requestedButtons, setRequestedButtons] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRole, setSelectedRole] = useState(UserRole.BASIC);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async (role: string, page: number) => {
    try {
      const data = await UserService.getAllUsersByRole(role, page);
      setUsers(data);

      const librarianEmails = data
        .filter((user) => user.role !== UserRole.BASIC)
        .map((user) => user.email);
      setRequestedButtons(librarianEmails);
      getTotalUsers();
    } catch (error) {
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

  const getTotalUsers = async () => {
    try {
      const response = await UserService.getTotalUsers(selectedRole);
      const total = Math.ceil(response.length / ShowUserPage.PAGE_SIZE);
      setTotalPages(total - 1);
    } catch (error) {
      console.log(error);
      Alert.alert(`${error}`);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.role === selectedRole &&
      user.email.includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    fetchUsers(selectedRole, currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    fetchUsers(selectedRole, 0);
  }, [selectedRole]);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages && filteredUsers.length > 0) {
      setCurrentPage(currentPage + 1);
    }
  };

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
        {filteredUsers.map((user) => (
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
      <View style={styles.pageContainer}>
        <TouchableOpacity
          style={styles.pageButton}
          onPress={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <Text style={styles.pageButtonText}>
            {"<<"} Pág {currentPage}{" "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pageButton} onPress={goToNextPage}>
          <Text style={styles.pageButtonText}>
            Pág {currentPage + 1} {">>"}
          </Text>
        </TouchableOpacity>
      </View>
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
  pageButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    position: "static",
    marginVertical: "auto",
  },
  pageButtonText: {
    color: "#000",
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

export default AddLibrarian;
