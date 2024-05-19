import * as SecureStore from "expo-secure-store";

import { ServerAddress } from "../common/consts/serverAddress";
import {
  IChallenge,
  ICreateUser,
  ILogin,
  ILoginResponse,
  IUpdateKey,
  IUpdateUserDNI,
  IUser,
  IVerifyChallenge,
  IDeviceUIDResponse,
  IUpgradeBasicResponse,
  IUpgradeRoleResponse,
} from "../common/interfaces/User";
import { baseFetch } from "./fetch";

export class UserService {
  private static baseRoute: string = `${ServerAddress}users`;

  constructor() {}

  static async create(user: ICreateUser): Promise<ILoginResponse> {
    return baseFetch<ICreateUser, ILoginResponse>({
      url: this.baseRoute,
      method: "POST",
      data: user,
    });
  }

  static async login(email: string, password: string): Promise<ILoginResponse> {
    return baseFetch<ILogin, ILoginResponse>({
      url: `${this.baseRoute}/login`,
      method: "POST",
      data: { email, password },
    });
  }

  static async updatePublicKey(
    publicRSA: string,
    token: string,
    email: string,
  ): Promise<void> {
    const deviceUID = (await this.getUniqueId(email)).deviceUID;

    await SecureStore.setItemAsync(
      `deviceUID-${email.replace("@", "_")}`,
      deviceUID.toString(),
    );

    return baseFetch<IUpdateKey, void>({
      url: `${this.baseRoute}/rsa`,
      method: "POST",
      data: { publicRSA, deviceUID },
      token,
    });
  }

  static async getChallenge(email: string): Promise<IChallenge> {
    return baseFetch<void, IChallenge>({
      url: `${this.baseRoute}/challenge?user_email=${email}`,
      method: "GET",
    });
  }

  static async verifyChallenge(
    email: string,
    challenge: number[],
  ): Promise<ILoginResponse> {
    const deviceUID = (await this.getUniqueId(email)).deviceUID;

    return baseFetch<IVerifyChallenge, ILoginResponse>({
      url: `${this.baseRoute}/verify_challenge`,
      method: "POST",
      data: { email, deviceUID, challenge },
    });
  }

  static async acquireBasicLicence(
    dni: string,
    token: string,
  ): Promise<IUpgradeBasicResponse> {
    return baseFetch<IUpdateUserDNI, IUpgradeBasicResponse>({
      url: `${this.baseRoute}/dni`,
      method: "PATCH",
      data: { dni },
      token,
    });
  }

  static async getUniqueId(email: string): Promise<IDeviceUIDResponse> {
    const storedDeviceUID = await SecureStore.getItemAsync(
      `deviceUID-${email.replace("@", "_")}`,
    );

    if (storedDeviceUID) {
      return { deviceUID: parseInt(storedDeviceUID) };
    }
    return baseFetch<void, IDeviceUIDResponse>({
      url: `${this.baseRoute}/deviceUID?user_email=${email}`,
      method: "GET",
    });
  }

  static async addLibrarian(token: string): Promise<IUpgradeRoleResponse> {
    return baseFetch<void, IUpgradeRoleResponse>({
      url: `${this.baseRoute}/role`,
      method: "PATCH",
      token,
    });
  }

  static async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await baseFetch<void, IUser[]>({
        url: `${this.baseRoute}/get_all_users`,
        method: "GET",
      });

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}
