export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  dni?: string;
}

export interface ILoginResponse {
  access_token: string;
  user: IUser;
  detail?: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUpdateKey {
  publicRSA: string;
  deviceUID: string;
}

export interface IChallenge {
  challenge: string;
  detail?: string;
}

export interface IVerifyChallenge {
  email: string;
  deviceUID: string;
  challenge: number[];
}

export interface IUpdateUserDNI {
  dni: string;
}
