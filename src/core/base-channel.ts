export interface IChannelAdapter {
  name: string;
  initialize(): Promise<void>;
  sendMessage(to: string, message: string): Promise<void>;
}