/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { CustomExceptionFilter } from '../../../../libs/common/filters/exception.filter';

describe('Weather API (Integration)', () => {
  let app: INestApplication;

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

  it('should return weather for a valid city', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/weather?city=London')
      .expect(200);

    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('humidity');
    expect(res.body).toHaveProperty('description');
  }, 10000);

  it('should return 404 for an invalid city', async () => {
    await request(app.getHttpServer())
      .get('/api/weather?city=NonExistentCityForTest')
      .expect(404);
  });

  it('should return 400 for missing city parameter', async () => {
    await request(app.getHttpServer()).get('/api/weather').expect(400);
  });
});
