import { ServerAddress } from "../common/consts/serverAddress";
import { IFacialRegistrationResponse } from "../common/interfaces/FacialRecog";
import { formDataFetch } from "./fetch";
import * as FileSystem from 'expo-file-system';

export class FacialRecognitionService {
    private static baseRoute: string = `${ServerAddress}facial_recog`;

    static async registerFace(token: string, imageURI: string) {
        try {
            const fileInfo = await FileSystem.getInfoAsync(imageURI);
            if (!fileInfo.exists) {
              console.log('File does not exist.');
              return;
            }

            const fileContent = await FileSystem.readAsStringAsync(imageURI, {
              encoding: FileSystem.EncodingType.Base64,
            });

            const image = {
                uri: imageURI,
                name: 'image.jpg',
                type: 'image/jpg',
            }

            const formData = new FormData();
            formData.append('face', image as any);


            return formDataFetch<IFacialRegistrationResponse>({
                url: `${this.baseRoute}/register_face`,
                method: "POST",
                data: formData,
                token: token,
            });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
    }


}
