import { ServerAddress } from "../common/consts/serverAddress";
import { IUserDTO } from "../common/interfaces/User";
import { baseFetch } from "./fetch";

export class LibrarianService {
  private static baseRoute: string = `${ServerAddress}librarian`;

  constructor() {}

  static async consultUser(email: string, token: string): Promise<IUserDTO> {
    return baseFetch<void, IUserDTO>({
      token: token,
      url: `${this.baseRoute}/consult_user?user_email=${email}`,
      method: "GET",
    });
  }

  static async updateLicence(
    email: string,
    level: number,
    token: string,
  ): Promise<IUserDTO> {
    return baseFetch<void, IUserDTO>({
      token: token,
      url: `${this.baseRoute}/update_licence_user?user_email=${email}&level=${level}`,
      method: "PATCH",
    });
  }

  static async updateName(
    email: string,
    new_name: string,
    token: string,
  ): Promise<IUserDTO> {
    return baseFetch<void, IUserDTO>({
      token: token,
      url: `${this.baseRoute}/update_name_user?user_email=${email}&new_user_name=${new_name}`,
      method: "PATCH",
    });
  }

  static async updateLastName(
    email: string,
    new_last_name: string,
    token: string,
  ): Promise<IUserDTO> {
    return baseFetch<void, IUserDTO>({
      token: token,
      url: `${this.baseRoute}/update_lastName_user?user_email=${email}&new_user_last_name=${new_last_name}`,
      method: "PATCH",
    });
  }

  static async updateDNI(
    email: string,
    new_dni: string,
    token: string,
  ): Promise<IUserDTO> {
    return baseFetch<void, IUserDTO>({
      token: token,
      url: `${this.baseRoute}/update_dni_user?user_email=${email}&new_user_dni=${new_dni}`,
      method: "PATCH",
    });
  }

  static async deleteUser(email: string, token: string): Promise<IUserDTO> {
    return baseFetch<void, IUserDTO>({
      token: token,
      url: `${this.baseRoute}/delete_user?user_email=${email}`,
      method: "GET",
    });
  }

  static async checkUnsubscribeRequest(
    email: string,
    token: string,
  ): Promise<boolean> {
    const value = await baseFetch<void, boolean>({
      url: `${this.baseRoute}/check_delete_user?user_email=${email}`,
      method: "GET",
      token: token,
    });
    return value;
  }
}
