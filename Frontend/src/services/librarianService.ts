import { ServerAddress } from "../common/consts/serverAddress";
import { IUserDTOs } from "../common/interfaces/User";
import { baseFetch } from "./fetch";

export class LibrarianService {
  private static baseRoute: string = `${ServerAddress}users`;

  constructor() {}

  static async consultUser(email: string): Promise<IUserDTOs> {
    return baseFetch<void, IUserDTOs>({
      url: `${this.baseRoute}/librarian_consult_user?user_email=${email}`,
      method: "GET",
    });
  }

  static async deleteUser(email: string): Promise<IUserDTOs> {
    return baseFetch<void, IUserDTOs>({
      url: `${this.baseRoute}/librarian_delete_user?user_email=${email}`,
      method: "GET",
    });
  }

  static async updateLicense(email: string, level: number): Promise<IUserDTOs> {
    return baseFetch<void, IUserDTOs>({
      url: `${this.baseRoute}/librarian_update_license?user_email=${email}&level=${level}`,
      method: "GET",
    });
  }

  static async updateName(email: string, new_name: string): Promise<IUserDTOs> {
    return baseFetch<void, IUserDTOs>({
      url: `${this.baseRoute}/librarian_update_name?user_email=${email}&new_user_name=${new_name}`,
      method: "GET",
    });
  }

  static async updateLastName(
    email: string,
    new_last_name: string
  ): Promise<IUserDTOs> {
    return baseFetch<void, IUserDTOs>({
      url: `${this.baseRoute}/librarian_update_lastName?user_email=${email}&new_user_last_name=${new_last_name}`,
      method: "GET",
    });
  }

  static async updateDNI(email: string, new_dni: string): Promise<IUserDTOs> {
    return baseFetch<void, IUserDTOs>({
      url: `${this.baseRoute}/librarian_update_dni?user_email=${email}&new_user_dni=${new_dni}`,
      method: "GET",
    });
  }


}
