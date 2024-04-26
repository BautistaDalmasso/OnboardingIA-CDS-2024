import { ServerAddress } from "../common/consts/serverAddress";
import { IFacialRegistrationResponse } from "../common/interfaces/FacialRecog";
import { ILoginResponse } from "../common/interfaces/User";
import { formDataFetch } from "./fetch";

export class FacialRecognitionService {
  private static baseRoute: string = `${ServerAddress}facial_recog`;

  static async registerFace(token: string, imageURI: string) {
    try {
      const image = {
        uri: imageURI,
        name: "image.jpg",
        type: "image/jpg",
      };

      const formData = new FormData();
      formData.append("face", image as any);

      return formDataFetch<IFacialRegistrationResponse>({
        url: `${this.baseRoute}/register_face`,
        method: "POST",
        data: formData,
        token: token,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  static async compareFace(email: string, imageURI: string) {
    const image = {
      uri: imageURI,
      name: "image.jpg",
      type: "image/jpg",
    };

    const formData = new FormData();
    formData.append("face", image as any);

    return formDataFetch<ILoginResponse>({
      url: `${this.baseRoute}/login_face_recognition?user_email=${email}`,
      method: "POST",
      data: formData,
    });
  }
}
