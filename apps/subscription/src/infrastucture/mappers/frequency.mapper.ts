import { Frequency } from '../../domain/subscription/subscription.entity';

export function mapGrpcFrequencyToPrisma(frequency: number): Frequency {
  switch (frequency) {
    case 0:
      return Frequency.HOURLY;
    case 1:
      return Frequency.DAILY;
    default:
      throw new Error(`Unknown frequency value: ${frequency}`);
  }
}
