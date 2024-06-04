import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ILoanInformation } from "../../common/interfaces/LoanReqResponse";
import { LoanStatusCode } from "../../common/enums/loanStatus";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-gesture-handler";
import { LoanService } from "../../services/LoanManagementService";
import { useContextState } from "../../ContexState";

const ManagementLoan = ({ route }: { route: any }) => {
  const { loan }: { loan?: ILoanInformation } = route.params;
  const [selectedLoanStatus, setSelectedLoanStatus] = useState<
    LoanStatusCode | undefined
  >(loan?.loan_status);
  const [date, setDate] = useState(new Date());
  const [showPickerDate, setshowPickerDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const { contextState, setContextState } = useContextState();

  const showDueOptions = () => {
    if (
      selectedLoanStatus === LoanStatusCode.RESERVED ||
      selectedLoanStatus === LoanStatusCode.LOANED
    )
      return showDateDuePicker();
    else return;
  };
  const showDateDuePicker = () => {
    return (
      <View style={styles.due}>
        <Text style={styles.text}>Fecha de vencimiento: </Text>
        <TouchableOpacity onPress={toggleDatePicker}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="Seleccionar fecha"
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholderTextColor={"#11182744"}
              editable={false}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const toggleDatePicker = () => {
    setshowPickerDate(!showPickerDate);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setSelectedDate(formatDate(currentDate));

      if (Platform.OS === "android") {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const formatDate = (rawDate: Date) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleSelectedLoanStatus = () => {
    switch (selectedLoanStatus) {
      case LoanStatusCode.RESERVED:
        return setLoanStatusReserved();
      case LoanStatusCode.LOANED:
        return setLoanStatusLoaned();
      case LoanStatusCode.RETURNED:
        return setLoanStatusReturned();
      case LoanStatusCode.LOAN_RETURN_OVERDUE:
        return setLoanStatusReturnOverdue();
      case LoanStatusCode.RESERVATION_CANCELED:
        return setLoanStatusReservationCanceled();
      default:
        return null;
    }
  };
  const setLoanStatusReserved = async () => {
    try {
      if (loan && loan.id !== undefined && selectedDate !== undefined) {
        const date = new Date(selectedDate);
        const result = await LoanService.setLoanStatusReserved(
          loan?.id,
          selectedDate,
          contextState.accessToken as string,
        );
        Alert.alert("Modificación exitosa");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo modificar el prestamo");
    }
  };

  const setLoanStatusLoaned = async () => {
    try {
      if (loan && loan.id !== undefined && selectedDate !== undefined) {
        const date = new Date(selectedDate);
        const result = await LoanService.setLoanStatusLoaned(
          loan?.id,
          selectedDate,
          contextState.accessToken as string,
        );
        Alert.alert("Modificación exitosa");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo modificar el prestamo");
    }
  };

  const setLoanStatusReturned = async () => {
    try {
      if (loan && loan.id !== undefined) {
        const date = new Date(selectedDate);
        const result = await LoanService.setLoanStatusReturned(
          loan?.id,
          contextState.accessToken as string,
        );
        Alert.alert("Modificación exitosa");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo modificar el prestamo");
    }
  };

  const setLoanStatusReturnOverdue = async () => {
    try {
      if (loan && loan.id !== undefined) {
        const date = new Date(selectedDate);
        const result = await LoanService.setLoanStatusReturnOverdue(
          loan?.id,
          contextState.accessToken as string,
        );
        Alert.alert("Modificación exitosa");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo modificar el prestamo");
    }
  };

  const setLoanStatusReservationCanceled = async () => {
    try {
      if (loan && loan.id !== undefined) {
        const date = new Date(selectedDate);
        const result = await LoanService.setLoanStatusReservationCanceled(
          loan?.id,
          contextState.accessToken as string,
        );
        Alert.alert("Modificación exitosa");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo modificar el prestamo");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de prestamo</Text>
      <ScrollView style={styles.scroll}>
        <View style={styles.containerData}>
          <Text style={styles.text1}>Detalles del Préstamo</Text>
          <Text style={styles.text}>Usuario: {loan?.user_email}</Text>
          <Text style={styles.text}>
            Titulo del libro: {loan?.catalogue_data.title}
          </Text>
          <Text style={styles.text}>
            Fecha de reserva:{" "}
            {loan?.reservation_date
              ? new Date(loan.reservation_date).toLocaleDateString()
              : "No disponible"}
          </Text>
          <Text style={styles.text}>
            Fecha de retiro:{" "}
            {loan?.checkout_date
              ? new Date(loan.reservation_date).toLocaleDateString()
              : "No disponible"}
          </Text>
          <Text style={styles.text}>
            Fecha de devolución:{" "}
            {loan?.return_date
              ? new Date(loan.return_date).toLocaleDateString()
              : "No disponible"}
          </Text>
          <Text style={styles.text}>ISBN: {loan?.catalogue_data.isbn}</Text>
          <Text style={styles.text}>IDcopia: {loan?.inventory_number}</Text>
          <Text style={styles.text}>
            Fecha de vencimiento:{" "}
            {loan?.expiration_date
              ? new Date(loan.expiration_date).toLocaleDateString()
              : "No disponible"}
          </Text>
          <Text style={styles.text}>
            Estado actual del prestamo: {loan?.loan_status}
          </Text>
          <View style={styles.containerChanges}>
            <Text style={styles.text1}>Modificar Prestamo</Text>
            <Text style={styles.text}>
              Seleccione el estado que desee asignar:{" "}
            </Text>

            <Picker
              style={styles.picker}
              selectedValue={selectedLoanStatus}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedLoanStatus(itemValue)
              }
            >
              <Picker.Item label="Reservado" value={LoanStatusCode.RESERVED} />
              <Picker.Item
                label="Reserva cancelada"
                value={LoanStatusCode.RESERVATION_CANCELED}
              />
              <Picker.Item label="Prestado" value={LoanStatusCode.LOANED} />
              <Picker.Item label="Devuelto" value={LoanStatusCode.RETURNED} />
              <Picker.Item
                label="Devolución Retrasada"
                value={LoanStatusCode.LOAN_RETURN_OVERDUE}
              />
            </Picker>

            {showDueOptions()}

            {showPickerDate && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date || "Seleccionar fecha"}
                onChange={onChange}
                maximumDate={new Date("2029-1-1")}
                minimumDate={new Date("2024-1-1")}
              />
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Alert.alert(
                  "Guardar cambios",
                  "¿Estás seguro de que quieres guardar los cambios?",
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Guardar",
                      onPress: () => {
                        handleSelectedLoanStatus();
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }}
            >
              <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  containerData: {
    flexGrow: 1,
    backgroundColor: "white",
    padding: 10,

    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    marginTop: 8,
    backgroundColor: "#F3F3F3",
    width: "100%",
  },
  containerChanges: {
    flexGrow: 0.4,
    backgroundColor: "white",
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    marginTop: 10,
    backgroundColor: "#F3F3F3",
    height: 50,
    fontSize: 17,
    fontWeight: "500",
    color: "#111827cc",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  button: {
    marginTop: 50,
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
  text: {
    marginTop: 6,
    fontSize: 18,
  },
  placeholderContainer: {
    height: 200,
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  text1: {
    marginVertical: 15,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  due: {
    flex: 1,
    marginVertical: 10,
    flexDirection: "column",
  },
});

export default ManagementLoan;
