import { Test, TestingModule } from '@nestjs/testing';
import { CreateInsuranceDto, EHouseOwnershipStatus, EMaritalStatus } from '../dto/create-insurance.dto';
import { InsuranceService } from './insurance.service';

describe('InsuranceService - Home', () => {
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

  it(`1 - If the user doesn't have houses, she is ineligible for home insurance`, async () => {
    delete payload.house
    
    const score = await service.getHomeScore(payload, baseScore)
    expect(score).toBeNull()
    
    const carInsurancePlan = await service.scoreToPlan(score)
    expect(carInsurancePlan).toEqual('ineligible');
  });

  it('3 - If the user is under 30 years old, deduct 2 risk points from all lines of insurance.', async () => {
    payload.age = 29
    const score = await service.getHomeScore(payload, baseScore)
    expect(score).toEqual(-2)
  });

  it('3 - If she is between 30 and 40 years old, deduct 1 risk point.', async () => {
    payload.age = 30
    let score = await service.getHomeScore(payload, baseScore)
    expect(score).toEqual(-1)

    payload.age = 35
    score = await service.getHomeScore(payload, baseScore)
    expect(score).toEqual(-1)

    payload.age = 40
    score = await service.getHomeScore(payload, baseScore)
    expect(score).toEqual(-1)

    payload.age = 41
    score = await service.getHomeScore(payload, baseScore)
    expect(score).toEqual(0)

  });

  it('4 - If her income is above $200k, deduct 1 risk point', async () => {
    payload.income = 200000    
    let score = await service.getHomeScore(payload, baseScore)
    expect(score).toEqual(0)

    payload.income++
    score = await service.getHomeScore(payload, baseScore)
    expect(score).toEqual(-1)
  });

  it(`5 - If the user's house is mortgaged, add 1 risk point to her home score`, async () => {
    payload.house.ownershipStatus = EHouseOwnershipStatus.MORTGAGED 
    let score = await service.getHomeScore(payload, baseScore)
    expect(score).toEqual(1)
  });

});
