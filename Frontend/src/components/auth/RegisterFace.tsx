import { NavigationProp } from "@react-navigation/native";
import { Alert } from "react-native";
import { FacialRecognitionService } from "../../services/facialRecognitionService";
import { useContextState } from "../../ContexState";
import React from "react";
import { Routes } from "../../common/enums/routes";
import FaceRecognition from "./FaceRecognition/FaceRecognition";

interface Props {
  navigation: NavigationProp<any, any>;
}

const RegisterFace = ({ navigation }: Props) => {
  const { contextState } = useContextState();

  const sendRegister = async (embedding: number[]) => {
    try {
      if (contextState.accessToken === null) {
        throw Error("Access token was null during face register.");
      }
  
      const result = await FacialRecognitionService.registerFace(
        contextState.accessToken,
        embedding,
      );
  
      Alert.alert("Añadido correctamente.");
  
      navigation.navigate(Routes.Home);
    } catch (error) {
      Alert.alert("No pudimos guardar tu rostro.");
    }
  };

  return <FaceRecognition onSubmit={sendRegister} />;
};

export default RegisterFace;
