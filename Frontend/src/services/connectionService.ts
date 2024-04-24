import { ServerAddress } from "../common/consts/serverAddress";
import { IPingResponse } from "../common/interfaces/Connection";
import { baseFetch } from "./fetch";

export class ConnectionService {
  private static baseRoute: string = `${ServerAddress}ping`;

  static async isConnected(): Promise<boolean> {
    const timeoutMs = 1000;

    try {
      const fetchPromise = baseFetch<void, IPingResponse>({
        url: this.baseRoute,
        method: "GET",
      });

      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Timeout occurred"));
        }, timeoutMs);
      });

      await Promise.race([fetchPromise, timeoutPromise]);

      return true;
    } catch (error) {
      return false;
    }
  }
}
