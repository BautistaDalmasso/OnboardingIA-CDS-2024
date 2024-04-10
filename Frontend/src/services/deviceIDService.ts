import { Platform } from "react-native";


export class DeviceIDService {

    constructor() {}

    static async getUniqueId(): Promise<string> {
        return "1";
    };
}
