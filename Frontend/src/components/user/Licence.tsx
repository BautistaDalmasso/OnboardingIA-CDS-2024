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
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AntDesign } from '@expo/vector-icons';

interface Props {
  navigation: NavigationProp<any, any>;
}

const Licence = ({ navigation }: Props) => {
  const { contextState } = useContextState();
  const image = require("../../assets/headerLicence.png");

  function handleNavigateQR(): void {
    navigation.navigate(Routes.ViewQr);
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.titleHeader}>CARNET VIRTUAL</Text>
        </ImageBackground>
        <Image
                  source={require("../../assets/reader.png")}
                  style={styles.imageProfile}
                  resizeMode="contain"
                />
      </View>
      <View style={styles.containerLicence}>
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
           {/* TODO: prettier button. */}
           <TouchableOpacity
              onPress={handleNavigateQR}
              style={styles.cardLink}
            >
               <AntDesign name="qrcode" size={wp('9%')} color="#056D8D" />
              <Text style={styles.linkText}>Ver QR</Text>
            </TouchableOpacity>

          <View style={styles.imageLogo}>
                  <Image
                    source={require("../../assets/logo.png")}
                    style={styles.imageLogo}
                    resizeMode="contain"
                  />

      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    height: hp('100%'),
    width: wp('100%'),
    flex: 1,
  },
  headerContainer:{
      height: hp('25%'),
      width: wp('100%'),
  },
  titleHeader: {
    fontSize:hp('3.5%'),
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#056D8D",
    height: hp('15%'),
    width: wp('100%'),
    textAlign: "center",
    textShadowRadius: 30,
    textShadowColor: "#42FFD3",
    textAlignVertical: "top",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  imageProfile: {
    position: "absolute",
    marginVertical: hp('18%'),
    marginHorizontal: wp('38%'),
  },
  containerLicence: {
    alignItems: "center",
    height: hp('75%'),
    width: wp('95%'),
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.5,
    elevation: 7,
  },
  imageLogo: {
    width: wp('90%'),
    flex: 1,
    alignContent: "flex-end",
    marginTop:hp('1%'),
  },
  cardName: {
    flex: 0.7,
    width: wp('80%'),
    marginTop: hp('9%'),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#51D7FF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
  },
  name: {
    fontSize:wp('6%'),
    fontWeight: "bold",
    color: "#056D8D",
  },
  cardDni: {
    width: wp('80%'),
    marginTop: hp('3%'),
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#51D7FF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
  },
  cardMail: {
    width: wp('80%'),
    marginTop: hp('3%'),
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#51D7FF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
  },
  cardLink: {
    flexDirection:"row",
    width: wp('60%'),
    color: "#666",
    marginTop: wp('6%'),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#51D7FF",
    borderRadius: 10,
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
    fontSize: wp('5%'),
    fontWeight: "bold",
    color: "#056D8D",
  },
});

export default Licence;
