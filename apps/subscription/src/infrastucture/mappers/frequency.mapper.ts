import { Frequency } from '../../domain/subscription/subscription.entity';
import { RpcException } from '@nestjs/microservices';

export function mapGrpcFrequencyToPrisma(frequency: number): Frequency {
  switch (frequency) {
    case 0:
      return Frequency.HOURLY;
    case 1:
      return Frequency.DAILY;
    default:
      throw new RpcException({
        code: 3,
        message: `Unknown frequency value: ${frequency}`,
      });
  }
}
