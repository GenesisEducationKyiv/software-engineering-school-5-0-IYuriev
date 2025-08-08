export interface NotificationProvider {
  notifyHourly(): Promise<void>;
  notifyDaily(): Promise<void>;
}
