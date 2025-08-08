import { Frequency } from '../../application/interfaces/notification-sender.interface';
import { RpcException } from '@nestjs/microservices';

export function mapPrismaFrequencyToGrpc(frequency: Frequency): number {
  switch (frequency) {
    case Frequency.HOURLY:
      return 0;
    case Frequency.DAILY:
      return 1;
    default:
      throw new RpcException({ code: 3, message: 'Unknown frequency value' });
  }
}
