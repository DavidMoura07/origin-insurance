import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from '../services/insurance.service';
import { CreateInsuranceDto, EHouseOwnershipStatus, EMaritalStatus } from '../dto/create-insurance.dto';
import { InsurancePlans } from '../dto/insurance-package.dto';

describe('InsuranceController', () => {
  let controller: InsuranceController;
  let payload: CreateInsuranceDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsuranceController],
      providers: [InsuranceService],
    }).compile();

    controller = module.get<InsuranceController>(InsuranceController);

    payload = {
      age: 35,
      dependents: 2,
      house: {
        ownershipStatus: EHouseOwnershipStatus.OWNED
      },
      income: 0,
      maritalStatus: EMaritalStatus.MARRIED,
      riskQuestions: [0, 1, 0],
      vehicle: {
        year: 2018
      }
    }
  });

  it(`[post /insurance] validating package creation`, async () => {
    const packageInsurance = await controller.createInsurancePackage(payload)
    expect(packageInsurance.auto).toEqual(InsurancePlans.REGULAR)
    expect(packageInsurance.disability).toEqual(InsurancePlans.INELIGIBLE)
    expect(packageInsurance.home).toEqual(InsurancePlans.ECONOMIC)
    expect(packageInsurance.life).toEqual(InsurancePlans.REGULAR)
  });
});
