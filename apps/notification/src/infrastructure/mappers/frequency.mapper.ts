import { Frequency } from '../../application/interfaces/notification-sender.interface';

export function mapPrismaFrequencyToGrpc(frequency: Frequency): number {
  switch (frequency) {
    case Frequency.HOURLY:
      return 0;
    case Frequency.DAILY:
      return 1;
    default:
      throw new Error(`Unknown frequency value`);
  }
}
