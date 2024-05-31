import { ServerAddress } from "../common/consts/serverAddress";
import { ILoginResponse } from "../common/interfaces/User";
import { baseFetch } from "./fetch";

export class PointsExchangeService {
  private static baseRoute: string = `${ServerAddress}points_exchange`;

  constructor() {}

  static async updateToTrustedLicence(accessToken: string) {
    return await baseFetch<void, ILoginResponse>({
      url: `${this.baseRoute}/trusted_licence`,
      method: "POST",
      token: accessToken,
    });
  }
}
