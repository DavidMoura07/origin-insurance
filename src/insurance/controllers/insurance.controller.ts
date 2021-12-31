import { Controller, Post, Body } from '@nestjs/common';
import { InsuranceService } from '../services/insurance.service';
import { CreateInsuranceDto } from '../dto/create-insurance.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsurancePackageDto } from '../dto/insurance-package.dto';

@ApiTags('Insurance')
@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post()
  @ApiOperation({ summary: 'Create Exam' })
  @ApiResponse({ 
    status: 201, 
    description: 'Package Created.',
    type: InsurancePackageDto,
  })
  async createInsurancePackage(@Body() createInsuranceDto: CreateInsuranceDto): Promise<InsurancePackageDto> {
    return await this.insuranceService.createPackage(createInsuranceDto);
  }
}
