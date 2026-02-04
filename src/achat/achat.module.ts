import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchatController } from './achat.controller';
import { AchatService } from './achat.service';
import { Achat } from './entities/achat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achat])],
  controllers: [AchatController],
  providers: [AchatService],
  exports: [AchatService],
})
export class AchatModule {}
