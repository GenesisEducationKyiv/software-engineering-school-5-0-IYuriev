import { Module } from '@nestjs/common';
import { HttpClient } from 'src/infrastructure/http/http.client';

@Module({
  providers: [HttpClient],
  exports: [HttpClient],
})
export class HttpModule {}
