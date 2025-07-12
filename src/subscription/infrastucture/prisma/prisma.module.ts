import { Module } from '@nestjs/common';
import { PrismaService } from 'src/subscription/infrastucture/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
