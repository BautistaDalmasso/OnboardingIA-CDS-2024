import { NavigationProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useState } from "react";
import Constants from "expo-constants";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { DownloadQrService } from "../services/downloadQrService";
import { useContextState } from "../ContexState";
import { ConnectionType } from "../common/enums/connectionType";

interface Props {
  navigation: NavigationProp<any, any>;
}

const UserConfiguration = ({ navigation }: Props) => {
  const [qrUri, setQrUri] = useState<string | null>(null);
  const { contextState } = useContextState();

  useEffect(() => {
    const getQr = async () => {
      let uri = "";

      // if the user is online, search for possible updates to its qr code.
      if (contextState.connectionType === ConnectionType.ONLINE) {
        if (contextState.accessToken === null) {
          throw Error("User not logged in");
        }

        console.log("Updating qr.");
        await DownloadQrService.updateQrCode(contextState.accessToken);
      }

      uri = await DownloadQrService.getQrOffline();

      setQrUri(uri);
    };

    getQr();
  }, []);

  return (
    <View style={styles.container}>
      {qrUri !== null && (
        <Image source={{ uri: qrUri, cache: "reload" }} style={styles.qrCode} />
      )}
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  qrCode: {
    width: screenWidth * 0.8,
    aspectRatio: 1,
    resizeMode: "contain",
  },
});

export default UserConfiguration;
