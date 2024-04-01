import { ServerAddress } from "../common/consts/serverAddress";

export class BotService {
    constructor() {}

    static async fetchChatbotResponse(question: string): Promise<string> {
        let answer = "ERROR AL CONECTARSE CON SKYNET."

        console.log("Q: " + question)
        await fetch(ServerAddress, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "question": question })
            })
            .then(response => response.json())
            .then(data => {
                answer = data.answer
            })
            .catch(error => console.error(error))

        console.log("A: " + answer)

        return answer
    }
}
