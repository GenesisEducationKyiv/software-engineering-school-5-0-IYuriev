import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';

describe('Subscribe (e2e)', () => {
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

  const email = 'test@example.com';
  const city = 'Kyiv';
  const frequency = 'daily';

  it('should subscribe new user', async () => {
    const res = await request(app.getHttpServer() as unknown as Server)
      .post('/api/subscribe')
      .send({ email, city, frequency })
      .expect(201);

    expect(res.body).toHaveProperty('message');
  });

  it('should not allow duplicate subscription', async () => {
    await request(app.getHttpServer() as unknown as Server)
      .post('/api/subscribe')
      .send({ email, city, frequency })
      .expect(409);
  });

  it('should return 400 for invalid city', async () => {
    await request(app.getHttpServer() as unknown as Server)
      .post('/api/subscribe')
      .send({ email: 'other@example.com', city: 'InvalidCity', frequency })
      .expect(404);
  });
});
