import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { IMessage } from "../../common/interfaces/Message";
import { MessageType } from "../../common/enums/messageType";

interface Props {
  message: IMessage;
}

const Message = ({ message }: Props) => {
  return (
    <View
      style={
        message.type === MessageType.Bot
          ? styles.containerBot
          : styles.contatinerUser
      }
    >
      {message.type === MessageType.Bot && (
        <Image
          source={require("../../assets/bot-icon.png")}
          style={styles.botIcon}
          resizeMode="contain"
        />
      )}
      <View
        style={
          message.type === MessageType.Bot
            ? styles.messageBubbleBot
            : styles.messageBubbleUser
        }
      >
        <Text
          style={
            message.type === MessageType.Bot
              ? styles.messageTextBot
              : styles.messageTextUser
          }
        >
          {message.loading ? "···" : message.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerBot: {
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  contatinerUser: {
    marginBottom: 10,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  messageBubbleBot: {
    backgroundColor: "#f0f0f0",
    padding: 18,
    borderRadius: 30,
    borderBottomLeftRadius: 0,
  },
  messageBubbleUser: {
    backgroundColor: "#3369FF",
    padding: 18,
    borderRadius: 30,
    borderTopRightRadius: 0,
  },
  messageTextBot: {
    fontSize: 16,
  },
  messageTextUser: {
    fontSize: 16,
    color: "#ffffff",
  },
  botIcon: { width: 30, height: 30 },
});

export default Message;
