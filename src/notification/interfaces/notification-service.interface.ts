export interface INotificationService {
  notifyHourly(): Promise<void>;
  notifyDaily(): Promise<void>;
}
