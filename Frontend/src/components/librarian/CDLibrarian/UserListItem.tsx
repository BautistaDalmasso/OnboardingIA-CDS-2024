import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { IUser } from "../../../common/interfaces/User";
import useCDLibrarian from "../../../hooks/useCDLibrarian";
import { UserRole } from "../../../common/enums/user";

interface BookListItemProps {
  user: IUser;
  handleAddLibrarian: (user: IUser) => Promise<void>;
  handleDeleteLibrarian: (user: IUser) => Promise<void>;
  CDLibrarianConst: {
    userStatus: string[];
    selectedRole: UserRole;
    users: IUser[];
    setUserStatus: React.Dispatch<React.SetStateAction<string[]>>;
  };
}

const UserListItem = ({
  user,
  handleAddLibrarian,
  handleDeleteLibrarian,
  CDLibrarianConst,
}: BookListItemProps) => {
  return (
    <>
      <Text style={styles.bookTitle}>
        {user.firstName.toUpperCase() + " " + user.lastName.toUpperCase()}
      </Text>
      <Text style={styles.cardLevel}>Email: {user.email}</Text>
      <Text style={styles.cardLevel}>{user.role?.toUpperCase()}</Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: CDLibrarianConst.userStatus.includes(user.email)
              ? "#0047ab"
              : "#007bff",
          },
        ]}
        onPress={() =>
          CDLibrarianConst.userStatus.includes(user.email)
            ? handleDeleteLibrarian(user)
            : handleAddLibrarian(user)
        }
      >
        <Text style={styles.buttonText}>
          {CDLibrarianConst.userStatus.includes(user.email)
            ? "Cambiar a básico"
            : "Cambiar a bibliotecario"}
        </Text>
      </TouchableOpacity>
    </>
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

export default UserListItem;
