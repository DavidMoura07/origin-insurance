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
      maritalStatus: EMaritalStatus.SINGLE,
      riskQuestions: [0, 0, 0],
      vehicle: {
        year: 2000
      }
    }

    service = module.get<InsuranceService>(InsuranceService);
    
    baseScore = service.getBaseScore(payload)
  });

  it('2 - If the user is over 60 years old, she is ineligible for disability and life insurance.', async () => {
    payload.age = 60
    let score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(0)

    payload.age = 61
    score = await service.getLifeScore(payload, baseScore)
    expect(score).toBeNull()
  });

  it('3 - If the user is under 30 years old, deduct 2 risk points from all lines of insurance.', async () => {
    payload.age = 29
    const score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(-2)
  });

  it('3 - If she is between 30 and 40 years old, deduct 1 risk point.', async () => {
    payload.age = 30
    let score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(-1)

    payload.age = 35
    score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(-1)

    payload.age = 40
    score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(-1)

    payload.age = 41
    score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(0)

  });

  it('4 - If her income is above $200k, deduct 1 risk point', async () => {
    payload.income = 200000    
    let score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(0)

    payload.income++
    score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(-1)
  });

  it(`6 - If the user has dependents, add 1 risk point to both the disability and life scores.`, async () => {
    payload.dependents = 1
    let score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(1)
  });

  it(`7 - If the user is married, add 1 risk point to the life score and remove 1 risk point from disability.`, async () => {
    payload.maritalStatus = EMaritalStatus.MARRIED
    let score = await service.getLifeScore(payload, baseScore)
    expect(score).toEqual(1)
  });

});
