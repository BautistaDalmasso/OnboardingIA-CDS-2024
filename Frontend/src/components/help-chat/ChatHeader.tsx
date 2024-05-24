import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Routes } from "../../common/enums/routes";

const ChatHeader = ({ navigation }: StackHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(Routes.Home)}>
        <Image
          source={require("../../assets/arrow-left.png")}
          style={styles.backButton}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Image
        source={require("../../assets/bot-icon.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <View>
        <Text style={styles.botName}>Skynet V1.0</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator} />
          <Text style={styles.status}>Online</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  botName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3369FF",
  },
  statusContainer: { flexDirection: "row", alignItems: "center" },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  status: {
    marginLeft: 5,
    color: "green",
    fontWeight: "bold",
  },
  backButton: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
});

export default ChatHeader;
