import { MessageType } from "../enums/messageType";

export interface IMessage {
  text: string;
  type: MessageType;
  loading?: boolean;
}
