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
  const { contextState, setContextState } = useContextState();
  const [requestedButton, setRequestedButton] = useState<string[]>([]);

  const handleRequestButton = (email: string) => {
    setRequestedButton([...requestedButton, email]);
  };

  const isUserLibrarian = (email: string) => {
    return requestedButton.includes(email);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddLibrarian = async (user: IUser) => {
    try {
      const response = await UserService.addLibrarian(
        contextState.accessToken as string,
      );

      setContextState((state) => ({
        ...state,
        accessToken: response.access_token,
        user: {
          ...state.user,
          role: "librarian",
        } as IUser,
      }));

      handleRequestButton(user.email);
      Alert.alert(`Bibiotecario ${user.email} agregado con éxito`);
    } catch (error) {
      console.log(error);
      Alert.alert(`${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Libros</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {users.map((user) => (
          <View key={user.email} style={styles.bookContainer}>
            <Text style={styles.bookTitle}>{user.firstName}</Text>
            <Text style={styles.cardLevel}>Rol: {user.role}</Text>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isUserLibrarian(user.email)
                    ? "#ccc"
                    : "#007bff",
                },
              ]}
              onPress={() => handleAddLibrarian(user)}
              disabled={isUserLibrarian(user.email) && user.role != "basic"}
            >
              <Text style={styles.buttonText}>
                {isUserLibrarian(user.email) && user.role != "basic"
                  ? "Bibliotecario"
                  : "Agregar"}
              </Text>
            </TouchableOpacity>
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

export default AddLibrarian;
