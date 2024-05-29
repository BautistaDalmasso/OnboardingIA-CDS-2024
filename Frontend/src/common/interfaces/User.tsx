import { ILoanInformation } from "./LoanReqResponse";

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
  points: number;
}

export interface ILoginResponse {
  access_token: string;
  user: IUser;
  loans: ILoanInformation[];
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
}

export interface IDowngradeRoleResponse {
  role: string;
}

export interface IUpgradeUserRole {
  role: string;
  email: string;
}

export interface IDowngradeUserRole {
  role: string;
  email: string;
}

export interface IUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  dni?: string;
  licenceLevel?: number;
}
