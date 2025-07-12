import { Module } from '@nestjs/common';
import { HttpClient } from 'src/common/http/http.client';

@Module({
  providers: [HttpClient],
  exports: [HttpClient],
})
export class HttpModule {}
