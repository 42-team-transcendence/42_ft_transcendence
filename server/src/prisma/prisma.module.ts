import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //décorateur permettant d'utiliser ce module dans tous nos autres modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
