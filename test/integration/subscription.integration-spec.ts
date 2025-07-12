/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/subscription/infrastucture/prisma/prisma.service';
import * as request from 'supertest';

describe('Subscription API (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.token.deleteMany();
    await prisma.subscription.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  async function createSubscriptionAndGetToken(email: string) {
    await request(app.getHttpServer())
      .post('/api/subscribe')
      .send({ email, city: 'Kyiv', frequency: 'daily' });

    const sub = await prisma.subscription.findFirst({ where: { email } });
    const dbToken = await prisma.token.findFirst({
      where: { subscriptionId: sub?.id },
    });
    return dbToken?.token || '';
  }

  it('should confirm subscription with valid token', async () => {
    const token = await createSubscriptionAndGetToken('confirm@example.com');
    const res = await request(app.getHttpServer())
      .get(`/api/confirm/${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  it('should unsubscribe with valid token', async () => {
    const token = await createSubscriptionAndGetToken(
      'unsubscribe@example.com',
    );
    const res = await request(app.getHttpServer())
      .get(`/api/unsubscribe/${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  it('should return 400 for invalid token in confirm API', async () => {
    await request(app.getHttpServer())
      .get('/api/confirm/invalidtoken')
      .expect(400);
  });

  it('should return 400 for invalid token in unsubscribe API', async () => {
    await request(app.getHttpServer())
      .get('/api/unsubscribe/invalidtoken')
      .expect(400);
  });
});
