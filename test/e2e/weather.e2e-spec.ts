import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('Weather (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return weather for valid city', async () => {
    const res = await request(app.getHttpServer() as unknown as Server)
      .get('/api/weather?city=Kyiv')
      .expect(200);

    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('humidity');
    expect(res.body).toHaveProperty('description');
  });

  it('should return 404 for invalid city', async () => {
    await request(app.getHttpServer() as unknown as Server)
      .get('/api/weather?city=InvalidCityName123')
      .expect(404);
  });
});
