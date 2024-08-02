import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppImports } from './app.imports';
import { AppService } from './app.service';

@Module({
  imports: [...AppImports],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
