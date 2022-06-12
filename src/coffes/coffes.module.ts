import { Module } from '@nestjs/common';
import { CoffesController } from './coffes.controller';
import { CoffesService } from './coffes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffes } from './entity/coffes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffes])],
  controllers: [CoffesController],
  providers: [CoffesService],
})
export class CoffesModule {}
