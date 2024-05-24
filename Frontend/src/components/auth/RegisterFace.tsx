import { NavigationProp } from "@react-navigation/native";
import { FacialRecognitionService } from "../../services/facialRecognitionService";
import { useContextState } from "../../ContexState";
import Capture from "../common/Capture";
import React from "react";
import { Routes } from "../../common/enums/routes";

interface Props {
  navigation: NavigationProp<any, any>;
}

const RegisterFace = ({ navigation }: Props) => {
  const { contextState } = useContextState();

  const sendRegister = async (imageURI: string) => {
    if (contextState.accessToken === null) {
      throw Error("Access token was null during face register.");
    }

    const result = await FacialRecognitionService.registerFace(
      contextState.accessToken,
      imageURI,
    );

    alert(result.message);

    navigation.navigate(Routes.Home);
  };

  return <Capture onAccept={sendRegister}></Capture>;
};

export default RegisterFace;
