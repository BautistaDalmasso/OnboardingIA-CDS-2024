export class UserService {
  constructor() {}

  static async biometricLogin(signature: string): Promise<string> {
    console.log({ signature });
    return "token";
  }

  static async getUser(): Promise<string> {
    return "user";
  }

  static async updateUserToken(token: string): Promise<void> {
    console.log({ token });
  }
}
