import React,{useState} from "react";
import {
  Alert,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  StyleSheet,
} from "react-native";
import useRUDUsers from "../../hooks/useRUDUsers";
import  {LoanService}  from "../../services/LoanManagementService";
import { useContextState } from "../../ContexState";
import { useFocusEffect } from '@react-navigation/native';
import { checkIfConfigIsValid } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";

const LoanCreation = () => {
  const { contextState } = useContextState();
  const {consultUser,} = useRUDUsers();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [inventoryNumber, setInventoryNumber] = useState(0);
  const regexInventoryNumber = /^[0-9]+$/;

  useFocusEffect(
    React.useCallback(() => {
      return () => {
      };
    }, []),
  );

  const handleSubmit = async () => {
    try {
        setLoading(true);
      if (inventoryNumber===0 || email==='' ) {
        Alert.alert(
          "Error",
          "Por favor complete todos los datos antes de enviar.",
        );
        return;
      }

      if(!inventoryNumber || !regexInventoryNumber.test(inventoryNumber.toString())){
        console.log(inventoryNumber.toString() )
        Alert.alert(
          "Error",
          "Por favor ingrese el número de inventario sin espacios, puntos, guiones o comas.",
        );
        setInventoryNumber(0);
        return;
      }

      const user = await consultUser(email);
      const loanValid= await LoanService.check_loan_valid(inventoryNumber,email)
      if (user?.email == null) {
        Alert.alert("Error", "Usuario NO registrado");
        return;
      }
      console.log(loanValid?.inventory_number)
      if(loanValid?.inventory_number==null){
        Alert.alert("Error", "Numero de Inventario innexistente.");
        return;
      }
      else{
        await LoanService.assignLoan(
          inventoryNumber,
          email,
          contextState.accessToken as string,
        );
    
          Alert.alert(
            "¡Creación de prestamo exitosa!",
            "La realización del prestamo del libro solicitado por el usuario fue registrado exitosamente."
          );
      }

    }
    catch (error) {
      console.error("Error en creación de prestamo:", error);
    }
    finally {
      setEmail('')
      setInventoryNumber(0);
      setLoading(false);
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alta de Prestamo</Text>
      <Text style={styles.instruction}>
        Confirmar prestamo de un libro para el usuario del email indicado:{" "}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresar email de usuario ..."
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Ingresar número de inventario..."
        keyboardType="numeric"
        maxLength={13}
        value={inventoryNumber===0? '' : inventoryNumber.toString()}
        onChangeText={ (text) => setInventoryNumber(Number(text))}
      ></TextInput>
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}> Dar de alta el prestamo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 200,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#48bce4",
    textAlign: "center",
    bottom: 15,
  },
  instruction: {
    marginTop: 0,
    fontSize: 14,
    marginBottom: 40,
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
});
export default LoanCreation;
