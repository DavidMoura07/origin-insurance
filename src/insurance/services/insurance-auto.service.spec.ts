import { Test, TestingModule } from '@nestjs/testing';
import { CreateInsuranceDto, EHouseOwnershipStatus, EMaritalStatus } from '../dto/create-insurance.dto';
import { InsuranceService } from './insurance.service';

describe('InsuranceService - Auto', () => {
  let service: InsuranceService;
  let payload: CreateInsuranceDto;
  let baseScore: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsuranceService],
    }).compile();

    payload = {
      age: 50,
      dependents: 0,
      house: {
        ownershipStatus: EHouseOwnershipStatus.OWNED
      },
      income: 10,
      maritalStatus: EMaritalStatus.MARRIED,
      riskQuestions: [0, 0, 0],
      vehicle: {
        year: 2000
      }
    }

    service = module.get<InsuranceService>(InsuranceService);
    
    baseScore = service.getBaseScore(payload)
  });

  it(`1 - If the user doesn't have vehicles, she is ineligible for auto insurance`, async () => {
    delete payload.vehicle
    
    const autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toBeNull()
    
    const carInsurancePlan = await service.scoreToPlan(autoScore)
    expect(carInsurancePlan).toEqual('ineligible');
  });

  it('3 - If the user is under 30 years old, deduct 2 risk points from all lines of insurance.', async () => {
    payload.age = 29
    const autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(-2)
  });

  it('3 - If she is between 30 and 40 years old, deduct 1 risk point.', async () => {
    payload.age = 30
    let autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(-1)

    payload.age = 35
    autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(-1)

    payload.age = 40
    autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(-1)

    payload.age = 41
    autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(0)

  });

  it('4 - If her income is above $200k, deduct 1 risk point', async () => {
    payload.income = 200000    
    let autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(0)

    payload.income++
    autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(-1)
  });

  it(`8 - If the user's vehicle was produced in the last 5 years, add 1 risk point to that vehicle’s score.`, async () => {
    
    const currentYear = new Date().getFullYear()
    payload.vehicle.year = currentYear - 5
    
    let autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(1)

    payload.vehicle.year--
    autoScore = await service.getAutoScore(payload, baseScore)
    expect(autoScore).toEqual(0)
  });

});
