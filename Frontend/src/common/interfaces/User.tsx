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
  dni: null | string;
  licenceLevel: null | number;
  role: null | string;
  lastPermissionUpdate: Date;
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
  deviceUID: number;
}

export interface IChallenge {
  challenge: string;
  detail?: string;
}

export interface IVerifyChallenge {
  email: string;
  deviceUID: number;
  challenge: number[];
}

export interface IUpdateUserDNI {
  dni: string;
}

export interface IUpgradeBasicResponse {
  dni: string;
  access_token: string;
}

export interface IDeviceUIDResponse {
  deviceUID: number;
}

export interface IUpgradeRoleResponse {
  role: string;
  access_token: string;
}

export interface IDowngradeRoleResponse {
  role: string;
  access_token: string;
}

export interface IUpgradeUserRole {
  role: string;
  email: string;
}

export interface IDowngradeUserRole {
  role: string;
  email: string;
}

export interface IUserDTOs {
  firstName: string;
  lastName: string;
  email: string;
  dni?: string;
  licenceLevel?: number;
}
