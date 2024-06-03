import React, { useState, useRef } from "react";
import {
  Alert,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useRUDUsers from "../../hooks/useRUDUsers";
import { IUserDTO } from "../../common/interfaces/User";
<<<<<<< HEAD
import {
  LicenceLevel,
  licenceLevelToStr,
} from "../../common/enums/licenceLevels";
import { Picker } from "@react-native-picker/picker";
import LinkButton from "../common/LinkButton";

enum fieldOptions {
  FIRST_NAME = "Nombre",
  LAST_NAME = "Apellido",
  DNI = "DNI",
}
=======
import CaptureQR from "./CaptureQR";
import { BarCodeScanningResult } from "expo-camera/legacy";
import SelectUser from "./RUDScreens/SelectUser";
import UpdateUser from "./RUDScreens/UpdateUser";
import ViewUsersData from "./RUDScreens/ViewUsersData";
import UpgradeUsersLicence from "./RUDScreens/UpgradeUsersLicence";
>>>>>>> 40daf592fb0db0586d5a2a2e778bd18dceab60a7

enum pages {
  USER_SELECT = 0,
  USER_DATA = 1,
  UPDATE_DATA = 2,
  UPGRADE_LICENCE = 3,
}

const RUDUser = () => {
  const { consultUser } = useRUDUsers();
  const [inputValue, setInputValue] = useState("");
  const [_, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [user, setUser] = useState<IUserDTO | null>(null);
  const [scanningQr, setScanningQr] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        handleChangePage(pages.USER_SELECT);
      };
    }, []),
  );

  const handleChangePage = (pageIndex: number) => {
    setInputValue("");

    scrollViewRef.current?.scrollTo({
      y: pageIndex * Dimensions.get("window").height,
      animated: true,
    });
  };

  const qrScanned = async (scanningResult: BarCodeScanningResult) => {
    const parsedResult = JSON.parse(scanningResult.data);

    handleLoadingData(parsedResult.email);
    setScanningQr(false);
  };

  const gotoUpgradeLicenceLevel = async () => {
    if (!user?.dni) {
      Alert.alert(
        "Error",
        "El usuario NO tiene carnet regular ni dni registrados.",
      );
      return;
    }
    handleChangePage(pages.UPGRADE_LICENCE);
  };

  const onUserUpdateFinished = () => {
    handleChangePage(pages.USER_DATA);
    handleLoadingData((user as IUserDTO).email);
  };

  const onLicenceUpgradeFinished = () => {
    handleChangePage(pages.USER_DATA);
    handleLoadingData((user as IUserDTO).email);
  };

  const handleLoadingData = async (userEmail: string) => {
    try {
      setLoading(true);

      const user = await consultUser(userEmail);

      if (user === null) {
        Alert.alert("Error", "Usuario NO registrado");
        return;
      }

      handleChangePage(pages.USER_DATA);

      setUser(user);
    } catch (error) {
      console.error("Error in:", error);
    } finally {
      setLoading(false);
    }
  };

  if (scanningQr) {
    return (
      <CaptureQR
        onScan={async (scanningResult) => await qrScanned(scanningResult)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualización de usuario</Text>

      <ScrollView
        ref={scrollViewRef}
        pagingEnabled={false}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Select user page. */}
        <View key={pages.USER_SELECT} style={styles.page}>
          <SelectUser
            inputValue={inputValue}
            onPressSearch={(userEmail: string) => handleLoadingData(userEmail)}
            onPressScanQr={() => setScanningQr(true)}
          />
        </View>

        {/* View user's data page. */}
        <View key={pages.USER_DATA} style={styles.page}>
          <ViewUsersData
            user={user}
            onPressUpdateData={() => handleChangePage(pages.UPDATE_DATA)}
            onPressUpdateLicence={gotoUpgradeLicenceLevel}
            onPressSearchAnotherUser={() => (
              handleChangePage(pages.USER_SELECT), setInputValue("")
            )}
          />
        </View>

        {/* Update user's data page. */}
        <View key={pages.UPDATE_DATA} style={styles.page}>
          <UpdateUser
            startingInputValue={inputValue}
            user={user}
            onFinishUpdate={onUserUpdateFinished}
            onPressReturn={() => handleChangePage(pages.USER_DATA)}
          />
        </View>

        {/* Upgrade user's licence page */}
        <View key={pages.UPGRADE_LICENCE} style={styles.page}>
          <UpgradeUsersLicence
            user={user}
            disabled={false}
            onUpgradeFinished={onLicenceUpgradeFinished}
            onPressReturnToUsersData={() => handleChangePage(pages.USER_DATA)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 5,
    alignContent: "center",
  },
  title: {
    marginTop: 100,
    fontSize: 22,
    fontWeight: "bold",
    color: "#48bce4",
    textAlign: "center",
    marginBottom: 20,
  },
  instruction: {
    bottom: 15,
    marginBottom: 5,
    marginTop: 20,
  },

  input: {
    flex: 1,
    padding: 5,
    borderWidth: 0,
    width: 100,
  },
  button: {
    backgroundColor: "#3369FF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 100,
    maxWidth: 300,
    margin: 10,
  },
  buttonQR: {
    backgroundColor: "#48bce4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    maxWidth: 300,
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsContainer: {
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: "85%",
  },
  page: {
    width: Dimensions.get("window").width - 60,
    height: Dimensions.get("window").height,
    alignItems: "center",
    margin: 10,
  },
  inputContainer: {
    flexDirection: "row",
    height: "10%",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 35,
    paddingLeft: 5,
    borderColor: "#E6E6E6",
    borderWidth: 1,
  },
  buttonUpdateData: {
    backgroundColor: "#3369FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
    maxWidth: 300,
    marginHorizontal: 5,
  },
  textButtonUpdateData: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#E6E6E6",
    marginBottom: 10,
  },
});

export default RUDUser;
