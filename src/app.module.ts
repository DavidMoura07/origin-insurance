import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InsuranceModule } from './insurance/insurance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.example.env'],
      isGlobal: true,
    }),
    InsuranceModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {
}
