import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useContextState } from "../../ContexState";
import { NavigationProp } from "@react-navigation/native";
import { Routes } from "../../common/enums/routes";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Licence = ({ navigation }: Props) => {
  const { contextState } = useContextState();
  const image = require("../../assets/LicenceBack.png");

  function handleNavigateQR(): void {
    navigation.navigate(Routes.ViewQr);
  }

  return (
    <View style={styles.containerBack}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>CARNET VIRTUAL</Text>
          </View>

          <View style={styles.containerLicence}>
            <View style={styles.containerProfile}>
              <View style={styles.containerData}>
                <View style={styles.cardData}>
                  <View style={styles.cardName}>
                    {contextState.user && (
                      <Text style={styles.name}>
                        {contextState.user.firstName}{" "}
                        {contextState.user.lastName}
                      </Text>
                    )}
                  </View>
                  <View style={styles.cardDni}>
                    {contextState.user && (
                      <Text style={styles.name}>
                        DNI: {contextState.user.dni}
                      </Text>
                    )}
                  </View>
                  <View style={styles.cardMail}>
                    {contextState.user && (
                      <Text style={styles.name}>{contextState.user.email}</Text>
                    )}
                  </View>
                </View>
              </View>
              <Image
                source={require("../../assets/reader.png")}
                style={styles.imageProfile}
                resizeMode="contain"
              />
              <View style={styles.imageLogo}>
                <Image
                  source={require("../../assets/logo.png")}
                  style={styles.imageLogo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* TODO: prettier button. */}
          <TouchableOpacity
            onPress={handleNavigateQR}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>Ver QR</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  containerBack: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginLeft: "30%",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 33,
    marginRight: 90,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#056D8D",
  },
  containerLicence: {
    flex: 3,
    alignItems: "center",
  },
  containerProfile: {
    justifyContent: "center",
    alignItems: "center",
    width: 350,
    height: 480,
  },
  imageProfile: {
    position: "absolute",
    top: 0,
  },
  containerData: {
    alignItems: "center",
    top: 145,
    justifyContent: "space-evenly",
    width: 350,
    height: 580,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    padding: 10,
  },
  imageLogo: {
    top: 15,
    width: 340,
  },
  cardData: {
    alignItems: "center",
    width: 350,
    height: 320,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#056D8D",
  },

  cardName: {
    flex: 1,
    width: 280,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#51D7FF",
    borderRadius: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    padding: 5,
  },

  cardDni: {
    width: 280,
    fontSize: 22,
    color: "white",
    marginTop: 50,
    flex: 1,
    top: 0,
    alignItems: "center",
    justifyContent: "space-evenly",

    backgroundColor: "#51D7FF",
    borderRadius: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    padding: 10,
  },
  cardMail: {
    width: 280,
    fontSize: 22,
    color: "#666",
    marginTop: 50,
    flex: 1,
    top: 0,
    alignItems: "center",
    justifyContent: "space-evenly",

    backgroundColor: "#51D7FF",
    borderRadius: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    padding: 10,
  },
  linkContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});

export default Licence;
