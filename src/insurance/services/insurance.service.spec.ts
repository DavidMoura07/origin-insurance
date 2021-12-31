import { Test, TestingModule } from '@nestjs/testing';
import { CreateInsuranceDto, EHouseOwnershipStatus, EMaritalStatus } from '../dto/create-insurance.dto';
import { InsurancePlans } from '../dto/insurance-package.dto';
import { InsuranceService } from './insurance.service';

describe('InsuranceService - Commons', () => {
  let service: InsuranceService;
  let payload: CreateInsuranceDto

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsuranceService],
    }).compile();

    service = module.get<InsuranceService>(InsuranceService);

    payload = {
      age: 35,
      dependents: 2,
      house: {
        ownershipStatus: EHouseOwnershipStatus.OWNED
      },
      income: 0,
      maritalStatus: EMaritalStatus.MARRIED,
      riskQuestions: [0, 0, 0],
      vehicle: {
        year: 2018
      }
    }
  });

  it(`Validating base score calc`, async () => {    
    let baseScore = await service.getBaseScore(payload)
    expect(baseScore).toEqual(0)

    payload.riskQuestions = [1, 1, 1]
    baseScore = await service.getBaseScore(payload)
    expect(baseScore).toEqual(3)

    payload.riskQuestions = [1, 0, 0]
    baseScore = await service.getBaseScore(payload)
    expect(baseScore).toEqual(1)

    payload.riskQuestions = [0, 1, 0]
    baseScore = await service.getBaseScore(payload)
    expect(baseScore).toEqual(1)

    payload.riskQuestions = [0, 0, 1]
    baseScore = await service.getBaseScore(payload)
    expect(baseScore).toEqual(1)

    payload.riskQuestions = [1, 1, 1]
    baseScore = await service.getBaseScore(payload)
    expect(baseScore).toEqual(3)
    
  });

  it(`[scoreToPlan] 0 and below maps to “economic”.`, async () => {
    let score = 0
    let plan = await service.scoreToPlan(score)
    expect(plan).toEqual('economic')

    score = -1
    plan = await service.scoreToPlan(score)
    expect(plan).toEqual('economic')
  });

  it(`[scoreToPlan] 1 and 2 maps to “regular”`, async () => {
    let score = 1
    let plan = await service.scoreToPlan(score)
    expect(plan).toEqual('regular')

    score = 2
    plan = await service.scoreToPlan(score)
    expect(plan).toEqual('regular')
  });

  it(`[scoreToPlan] 3 and above maps to “responsible”`, async () => {
    let score = 3
    let plan = await service.scoreToPlan(score)
    expect(plan).toEqual('responsible')

    score = 4
    plan = await service.scoreToPlan(score)
    expect(plan).toEqual('responsible')
  });

  it(`[createPackage] validating package creation`, async () => {
    const packageInsurance = await service.createPackage(payload)
    expect(packageInsurance.auto).toEqual(InsurancePlans.ECONOMIC)
    expect(packageInsurance.disability).toEqual(InsurancePlans.INELIGIBLE)
    expect(packageInsurance.home).toEqual(InsurancePlans.ECONOMIC)
    expect(packageInsurance.life).toEqual(InsurancePlans.REGULAR)
  });

});
