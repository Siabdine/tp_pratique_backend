import { Achat } from './achat/entities/achat.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchatController } from './achat/achat.controller';
import { AchatService } from './achat/achat.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-mesvehicules.alwaysdata.net',
      port: 3306,
      username: 'mesvehicules',
      password: 'TGE3FhiE!bZ6w.!',
      database: 'mesvehicules_gestion_achat',
      entities: [Achat],
      synchronize: true, // À désactiver en production
    }),
    TypeOrmModule.forFeature([Achat]),
  ],
  controllers: [AchatController],
  providers: [AchatService],
})
export class AppModule {}
