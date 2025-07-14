/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/subscription/infrastucture/prisma/prisma.service';
import { HttpClient } from '../../src/common/http/http.client';
import * as request from 'supertest';

describe('Subscription API (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpClient)
      .useValue({
        get: jest.fn(() => Promise.resolve({})),
        post: jest.fn(() => Promise.resolve({})),
      })
      .compile();

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
      .post('/api/subscription/subscribe')
      .send({ email, city: 'Kyiv', frequency: 'daily' });

    const sub = await prisma.subscription.findFirst({ where: { email } });
    const dbToken = await prisma.token.findFirst({
      where: { subscriptionId: sub?.id },
    });
    return dbToken?.token || '';
  }

  it('should confirm subscription with valid token', async () => {
    const token = await createSubscriptionAndGetToken('confirm@example.com');
    await request(app.getHttpServer())
      .get(`/api/subscription/confirm/${token}`)
      .expect(200);
  });

  it('should unsubscribe with valid token', async () => {
    const token = await createSubscriptionAndGetToken(
      'unsubscribe@example.com',
    );
    await request(app.getHttpServer())
      .get(`/api/subscription/unsubscribe/${token}`)
      .expect(200);
  });

  it('should return 400 for invalid token in confirm API', async () => {
    await request(app.getHttpServer())
      .get('/api/subscription/confirm/invalidtoken')
      .expect(400);
  });

  it('should return 400 for invalid token in unsubscribe API', async () => {
    await request(app.getHttpServer())
      .get('/api/subscription/unsubscribe/invalidtoken')
      .expect(400);
  });
});
