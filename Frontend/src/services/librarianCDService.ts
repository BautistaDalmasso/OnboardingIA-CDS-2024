import { ServerAddress } from "../common/consts/serverAddress";
import {
  IUpgradeRoleResponse,
  IUpgradeUserRole,
  IDowngradeRoleResponse,
  IDowngradeUserRole,
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
}
