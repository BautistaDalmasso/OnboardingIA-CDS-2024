import React, { useRef, useState } from "react";
import {
  TouchableOpacity,
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import useLoanCreation from "../../hooks/useLoanCreation";
import { Routes } from "../../common/enums/routes";

interface Props {
  navigation: NavigationProp<any, any>;
}

enum pages {
  CHECK_USER = 0,
  ENTER_INVENTORY_NUMBER = 1,
}

const AssignLoanManually = ({ navigation: navigator }: Props) => {
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [inventoryNumber, setInventoryNumber] = useState(0);
  const { assignLoan, checkUser } = useLoanCreation();
  const [firstName, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [licence, setLicence] = useState("");
  const [showUser, setShowUser] = useState(false);

  /*this function is used to return the screen to its original state, in case the user exits the screen */
  useFocusEffect(
    React.useCallback(() => {
      setEmail("");
      setShowUser(false);
      handleChangePage(pages.CHECK_USER);

      return () => {};
    }, [])
  );

  const handleChangePageCheckUser = () => {
    setShowUser(false);
    setEmail("");
    handleChangePage(pages.CHECK_USER);
  };

  const handleChangePage = (pageIndex: number) => {
    scrollViewRef.current?.scrollTo({
      y: pageIndex * Dimensions.get("window").height,
      animated: true,
    });
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
      handleChangePage(pages.ENTER_INVENTORY_NUMBER);
      setInventoryNumber(0);
    } catch (error) {
      console.error("Error in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Routes.AssignLoanManually}</Text>

      {showUser && (
        <View style={styles.cardUserContainer}>
          <Text style={styles.cardUserTitle}>
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
          <TouchableOpacity
            onPress={() => navigator.navigate(Routes.ManageLoans)}
          >
            <Text style={styles.link}> {"<< volver "}</Text>
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
          <TouchableOpacity onPress={handleChangePageCheckUser}>
            <Text style={styles.link}> {"<< volver "}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
  },
  title: {
    marginTop: 100,
    fontSize: 22,
    fontWeight: "bold",
    color: "#48bce4",
    textAlign: "center",
    bottom: 15,
  },
  instruction: {
    fontSize: 16,
    margin: 5,
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
  cardUserContainer: {
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
  cardUserTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardLevel: {
    fontSize: 14,
    marginBottom: 5,
  },
  page: {
    height: Dimensions.get("window").height,
    width: "100%",
    paddingHorizontal: 10,
  },
  link: {
    color: "blue",
    alignSelf: "center",
    margin: 20,
    fontSize: 16,
  },
});
export default AssignLoanManually;
