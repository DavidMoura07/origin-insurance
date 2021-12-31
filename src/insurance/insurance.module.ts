import { Module } from '@nestjs/common';
import { InsuranceService } from './services/insurance.service';
import { InsuranceController } from './controllers/insurance.controller';

@Module({
  controllers: [InsuranceController],
  providers: [InsuranceService]
})
export class InsuranceModule {}
