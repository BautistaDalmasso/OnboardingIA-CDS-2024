import { ServerAddress } from "../common/consts/serverAddress";
import { IFacialRegistrationResponse } from "../common/interfaces/FacialRecog";
import { ILoginFace, ILoginResponse, IRegisterFace } from "../common/interfaces/User";
import { baseFetch, } from "./fetch";

export class FacialRecognitionService {
  private static baseRoute: string = `${ServerAddress}facial_recog`;

  static async registerFace(token: string, embedding: number[]) {
    try {
      return baseFetch<IRegisterFace, IFacialRegistrationResponse>({
        url: `${this.baseRoute}/register_face`,
        method: "POST",
        data: { embedding },
        token: token,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  static async compareFace(email: string, embedding: number[]) {
    return baseFetch<ILoginFace, ILoginResponse>({
      url: `${this.baseRoute}/login_face_recognition`,
      method: "POST",
      data: { email, embedding },
    });
  }
}
