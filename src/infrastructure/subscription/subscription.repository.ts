import { Injectable } from '@nestjs/common';
import {
  CreateSubscriptionPayload,
  SubscriptionRepo,
} from 'src/core/subscription/subscription-repoository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Frequency } from 'src/core/subscription/subscription.entity';
import { Subscription } from 'src/constants/types/subscription';

@Injectable()
export class SubscriptionRepository implements SubscriptionRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getConfirmedSubscriptions(
    frequency: Frequency,
  ): Promise<Subscription[]> {
    const subs = await this.prisma.subscription.findMany({
      where: { confirmed: true, frequency },
      include: { tokens: true },
    });
    return subs.map((sub) => ({
      id: sub.id,
      email: sub.email,
      city: sub.city,
      token: sub.tokens[0]?.token,
      confirmed: sub.confirmed,
    }));
  }

  async findSubscription(
    payload: CreateSubscriptionPayload,
  ): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: {
        email: payload.email,
        city: payload.city,
        frequency: payload.frequency,
      },
    });
  }

  async create(payload: CreateSubscriptionPayload): Promise<Subscription> {
    return this.prisma.subscription.create({
      data: {
        email: payload.email,
        city: payload.city,
        frequency: payload.frequency,
      },
    });
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
