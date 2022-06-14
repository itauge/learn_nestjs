import { Module } from '@nestjs/common';
import { CoffesController } from './coffes.controller';
import { CoffesService } from './coffes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffes } from './entity/coffes.entity';
import { Flavor } from './entity/flavor.entity';
import { Event } from '../events/entity/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffes, Flavor, Event])],
  controllers: [CoffesController],
  providers: [CoffesService],
})
export class CoffesModule {}
