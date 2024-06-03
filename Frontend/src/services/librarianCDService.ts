import { ServerAddress } from "../common/consts/serverAddress";
import { ShowUserPage } from "../common/enums/Page";
import {
  IUpgradeRoleResponse,
  IUpgradeUserRole,
  IDowngradeRoleResponse,
  IDowngradeUserRole,
  IUser,
  ITotalUsers,
} from "../common/interfaces/User";
import { baseFetch } from "./fetch";

export class librarianServiceCD {
  private static baseRoute: string = `${ServerAddress}librarianCD`;

  constructor() {}

  static async addLibrarian(
    email: string,
    token: string,
  ): Promise<IUpgradeRoleResponse> {
    return baseFetch<IUpgradeUserRole, IUpgradeRoleResponse>({
      url: `${this.baseRoute}/update_role_to_librarian`,
      method: "PATCH",
      data: { role: "librarian", email },
      token,
    });
  }

  static async deleteLibrarian(
    email: string,
    token: string,
  ): Promise<IDowngradeRoleResponse> {
    return baseFetch<IDowngradeUserRole, IDowngradeRoleResponse>({
      url: `${this.baseRoute}/downgrade_role_to_user`,
      method: "PATCH",
      data: { role: "basic", email },
      token,
    });
  }

  static async getUsersByRole(
    role: string,
    page_number: number,
  ): Promise<IUser[]> {
    try {
      const users = await baseFetch<void, IUser[]>({
        url: `${this.baseRoute}/get_users?page_size=${ShowUserPage.PAGE_SIZE}&page_number=${page_number}&role=${role}`,
        method: "GET",
      });

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  static async countOfUsersByRole(role: string): Promise<ITotalUsers> {
    try {
      const value = await baseFetch<void, ITotalUsers>({
        url: `${this.baseRoute}/get_users_length_by_role?role=${role}`,
        method: "GET",
      });

      return value;
    } catch (error) {
      console.error("Error fetching users length:", error);
      throw error;
    }
  }
}
