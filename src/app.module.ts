import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffesController } from './coffes/coffes.controller';
import { CoffesService } from './coffes/coffes.service';
import { CoffesModule } from './coffes/coffes.module';

@Module({
  imports: [CoffesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
