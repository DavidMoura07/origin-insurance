import { Injectable } from '@nestjs/common';
import { CreateInsuranceDto, EHouseOwnershipStatus, EMaritalStatus } from '../dto/create-insurance.dto';
import { InsurancePackageDto, InsurancePlans } from '../dto/insurance-package.dto';

@Injectable()
export class InsuranceService {
  async createPackage(createInsuranceDto: CreateInsuranceDto): Promise<InsurancePackageDto> {

    const baseScore = this.getBaseScore(createInsuranceDto)

    const scoreAuto = this.getAutoScore(createInsuranceDto, baseScore)
    const scoreDisability = this.getDisabilityScore(createInsuranceDto, baseScore)
    const scoreHome = this.getHomeScore(createInsuranceDto, baseScore)
    const scoreLife = this.getLifeScore(createInsuranceDto, baseScore)

    const insurancePackage =  new InsurancePackageDto()
    
    insurancePackage.auto = await this.scoreToPlan(await scoreAuto)
    insurancePackage.disability = await this.scoreToPlan(await scoreDisability)
    insurancePackage.home = await this.scoreToPlan(await scoreHome)
    insurancePackage.life = await this.scoreToPlan(await scoreLife)
    
    return insurancePackage
  }

  public async getAutoScore(createInsuranceDto: CreateInsuranceDto, baseScore: number): Promise<number> {

    if (!createInsuranceDto.vehicle) {
      return null
    }

    if (createInsuranceDto.age < 30) {
      baseScore -= 2
    } else if (createInsuranceDto.age >= 30 && createInsuranceDto.age <=40) {
      baseScore--
    }

    if (createInsuranceDto.income > 200000) {
      baseScore--
    }

    const currentYear = new Date().getFullYear()
    if (currentYear - createInsuranceDto.vehicle?.year <= 5) {
      baseScore++
    }

    return baseScore
  }

  public async getDisabilityScore(createInsuranceDto: CreateInsuranceDto, baseScore: number): Promise<number> {

    if (createInsuranceDto.income <=0 || !createInsuranceDto.income ) {
      return null
    }

    if (createInsuranceDto.age > 60) {
      return null
    }

    if (createInsuranceDto.age < 30) {
      baseScore -= 2
    } else if (createInsuranceDto.age >= 30 && createInsuranceDto.age <=40) {
      baseScore--
    }

    if (createInsuranceDto.income > 200000) {
      baseScore--
    }

    if (createInsuranceDto.house?.ownershipStatus === EHouseOwnershipStatus.MORTGAGED) {
      baseScore++
    }

    if (createInsuranceDto.dependents > 0) {
      baseScore++
    }

    if(createInsuranceDto.maritalStatus === EMaritalStatus.MARRIED) {
      baseScore--
    }

    return baseScore
  }

  public async getHomeScore(createInsuranceDto: CreateInsuranceDto, baseScore: number): Promise<number> {

    if (!createInsuranceDto.house) {
      return null
    }

    if (createInsuranceDto.age < 30) {
      baseScore -= 2
    } else if (createInsuranceDto.age >= 30 && createInsuranceDto.age <=40) {
      baseScore--
    }

    if (createInsuranceDto.income > 200000) {
      baseScore--
    }

    if (createInsuranceDto.house?.ownershipStatus === EHouseOwnershipStatus.MORTGAGED) {
      baseScore++
    }

    return baseScore
  }

  public async getLifeScore(createInsuranceDto: CreateInsuranceDto, baseScore: number): Promise<number> {

    if (createInsuranceDto.age > 60) {
      return null
    }
    
    if (createInsuranceDto.age < 30) {
      baseScore -= 2
    } else if (createInsuranceDto.age >= 30 && createInsuranceDto.age <=40) {
      baseScore--
    }

    if (createInsuranceDto.income > 200000) {
      baseScore--
    }

    if (createInsuranceDto.dependents > 0) {
      baseScore++
    }

    if(createInsuranceDto.maritalStatus === EMaritalStatus.MARRIED) {
      baseScore++
    }

    return baseScore
  }

  public async scoreToPlan(score: number | null): Promise<InsurancePlans> {
    
    if (score === null) {
      return InsurancePlans.INELIGIBLE
    }
    
    if (score <= 0) {
      return InsurancePlans.ECONOMIC
    } 
    
    if (score >= 1 && score <= 2) {
      return InsurancePlans.REGULAR
    } 
    
    if (score >= 3) {
      return InsurancePlans.RESPONSIBLE
    }
  }

  public getBaseScore(createInsuranceDto: CreateInsuranceDto): number {
    return createInsuranceDto.riskQuestions.reduce((prev, curr) => prev + curr)
  }
}
