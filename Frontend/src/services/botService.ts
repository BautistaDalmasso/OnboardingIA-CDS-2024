import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";

export class BotService {
  private static baseRoute: string = `${ServerAddress}chatbot`;

  constructor() {}

  static async fetchChatbotResponse(question: string): Promise<string> {
    let answer = "ERROR AL CONECTARSE CON SKYNET.";

    try {
      const response = await baseFetch<unknown, any>({
        url: this.baseRoute,
        method: "POST",
        data: { question },
      });
      answer = response.answer;
    } catch (error) {
      console.log(error);
    }

    console.log("A: " + answer);

    return answer;
  }
}
