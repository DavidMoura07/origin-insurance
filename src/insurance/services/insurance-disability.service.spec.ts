import { Test, TestingModule } from '@nestjs/testing';
import { CreateInsuranceDto, EHouseOwnershipStatus, EMaritalStatus } from '../dto/create-insurance.dto';
import { InsuranceService } from './insurance.service';

describe('InsuranceService - Disability', () => {
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

  it(`1 - If the user doesn't have income, she is ineligible for disability`, async () => {
    payload.income = 0        
    const disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toBeNull()
    
    const disabilityInsurancePlan = await service.scoreToPlan(disabilityScore)
    expect(disabilityInsurancePlan).toEqual('ineligible');
  });

  it('2 - If the user is over 60 years old, she is ineligible for disability insurance.', async () => {
    payload.age = 60     
    let disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toBeGreaterThanOrEqual(0)

    payload.age++
    disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toBeNull()
    
    const disabilityInsurancePlan = await service.scoreToPlan(disabilityScore)
    expect(disabilityInsurancePlan).toEqual('ineligible');
  });

  it('3 - If the user is under 30 years old, deduct 2 risk points from all lines of insurance.', async () => {
    payload.age = 29    
    let disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(-2)
    
    payload.age = 0
    disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(-2)
  });

  it('3 - If she is between 30 and 40 years old, deduct 1 risk point.', async () => {    
    payload.age = 30
    let disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(-1)
    
    payload.age = 35
    disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(-1)

    payload.age = 40
    disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(-1)

    payload.age = 41
    disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(0)
    
  });

  it('4 - If her income is above $200k, deduct 1 risk point', async () => {
    payload.income = 200000
    
    let disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(0)

    payload.income++
    disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(-1)
  });

  it(`5 - If the user's house is mortgaged, add 1 risk point to her disability score.`, async () => {
    payload.house.ownershipStatus = EHouseOwnershipStatus.MORTGAGED    
    let disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(1)
  });

  it(`6 - If the user has dependents, add 1 risk point to disability scores.`, async () => {
    payload.dependents = 1    
    let disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(1)

    payload.dependents = 0
    disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(0)
  });

  it(`7 - If the user is married, remove 1 risk point from disability.`, async () => {
    payload.maritalStatus = EMaritalStatus.MARRIED
    let disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(-1)

    payload.maritalStatus = EMaritalStatus.SINGLE
    disabilityScore = await service.getDisabilityScore(payload, baseScore)
    expect(disabilityScore).toEqual(0)
  });

});
