import { Injectable } from '@nestjs/common';
import {
  SubscriptionPayload,
  SubscriptionRepo,
} from 'src/core/subscription/subscription-repoository.interface';
import { PrismaService } from '../prisma/prisma.service';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/core/subscription/subscription.entity';
import { mapToSubscriptionEntity } from '../mappers/subscription.mapper';

@Injectable()
export class SubscriptionRepository implements SubscriptionRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getConfirmedSubscriptions(
    frequency: Frequency,
  ): Promise<SubscriptionEntity[]> {
    const subs = await this.prisma.subscription.findMany({
      where: { confirmed: true, frequency },
      include: { tokens: true },
    });
    return subs.map(mapToSubscriptionEntity);
  }

  async findSubscription(
    payload: SubscriptionPayload,
  ): Promise<SubscriptionEntity | null> {
    const { email, city, frequency } = payload;
    const subscription = await this.prisma.subscription.findFirst({
      where: { email, city, frequency },
      include: { tokens: true },
    });

    return subscription ? mapToSubscriptionEntity(subscription) : null;
  }

  async create(payload: SubscriptionPayload): Promise<SubscriptionEntity> {
    const { email, city, frequency } = payload;
    const subscription = await this.prisma.subscription.create({
      data: { email, city, frequency },
      include: { tokens: true },
    });

    return mapToSubscriptionEntity(subscription);
  }

  async confirm(id: number): Promise<void> {
    await this.prisma.subscription.update({
      where: { id },
      data: { confirmed: true },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.subscription.delete({
      where: { id },
    });
  }
}
