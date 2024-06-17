import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { UserRole } from "../../../common/enums/user";
import { Picker } from "@react-native-picker/picker";
import { SearchBar } from "@rneui/themed";
import Pagination from "../../common/Pagination";
import useCDLibrarian from "../../../hooks/useCDLibrarian";
import UserListItem from "./UserListItem";

const CDLibrarian = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    handleAddLibrarian,
    handleDeleteLibrarian,
    CDLibrarianConst,
    paginationConst,
  } = useCDLibrarian();

  const filteredUsers = () => {
    return CDLibrarianConst.users.filter((user) =>
      user.email.includes(searchTerm.toLowerCase()),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuarios</Text>
      <Picker
        selectedValue={CDLibrarianConst.selectedRole}
        style={styles.picker}
        onValueChange={(itemValue) =>
          paginationConst.setSelectedRole(itemValue)
        }
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
            <UserListItem
              user={user}
              handleAddLibrarian={handleAddLibrarian}
              handleDeleteLibrarian={handleDeleteLibrarian}
              CDLibrarianConst={CDLibrarianConst}
            />
          </View>
        ))}
      </ScrollView>
      <Pagination
        currentPage={paginationConst.currentPage}
        goToPreviousPage={paginationConst.goToPreviousPage}
        goToNextPage={paginationConst.goToNextPage}
        lastPage={paginationConst.totalPages}
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
