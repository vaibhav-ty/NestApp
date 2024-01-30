import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('=========>>>>>>>>>>>>>');
        console.log('DB_HOST', configService.get('DB_HOST'));
        console.log('DB_PORT', configService.get('DB_PORT'));
        console.log('DB_USERNAME', configService.get('DB_USERNAME'));
        console.log('DB_PASSWORD', configService.get('DB_PASSWORD'));
        console.log('DB_NAME', configService.get('DB_NAME'));
        return {
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [join(process.cwd(), 'dist/**/*.entity.js')],
            // do NOT use synchronize: true in real projects
            synchronize: true,
          }
      },
    }),
    CitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
