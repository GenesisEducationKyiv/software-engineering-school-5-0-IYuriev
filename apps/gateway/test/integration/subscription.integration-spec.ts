/* eslint-disable */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { CustomExceptionFilter } from '../../../../libs/common/filters/exception.filter';

describe('Subscription API (Integration)', () => {
  let app: INestApplication;
  let testToken: string;
  const testEmail = `tests+${Date.now()}@example.com`;
  const testCity = 'Kyiv';
  const testFrequency = 1;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new CustomExceptionFilter());
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should subscribe a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/subscribe')
      .send({ email: testEmail, city: testCity, frequency: testFrequency })
      .expect(201);
    testToken = res.body.token;
    console.log('Test token:', testToken);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Subscription successful');
  });

  it('should return 409 if email already subscribed', async () => {
    await request(app.getHttpServer())
      .post('/api/subscribe')
      .send({ email: testEmail, city: testCity, frequency: testFrequency })
      .expect(409);
  });
});
