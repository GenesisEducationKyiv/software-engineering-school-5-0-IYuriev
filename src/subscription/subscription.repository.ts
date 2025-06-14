import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationFrequency } from '../constants/enums/subscription';
import { ISubscriptionRepository } from './interfaces/subscription-repoository.interface';
import { ISubscription } from 'src/constants/types/subscription';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getConfirmedSubscriptions(
    frequency: NotificationFrequency,
  ): Promise<ISubscription[]> {
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
    dto: CreateSubscriptionDto,
  ): Promise<ISubscription | null> {
    return this.prisma.subscription.findFirst({
      where: { email: dto.email, city: dto.city, frequency: dto.frequency },
    });
  }

  async create(dto: CreateSubscriptionDto): Promise<ISubscription> {
    return this.prisma.subscription.create({
      data: {
        email: dto.email,
        city: dto.city,
        frequency: dto.frequency,
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
