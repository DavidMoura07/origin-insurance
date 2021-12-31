import { ApiProperty } from "@nestjs/swagger"
import { ArrayMaxSize, 
  ArrayMinSize, 
  IsArray, 
  IsEnum, 
  IsInt, 
  IsNotEmpty, 
  IsNumber, 
  IsObject, 
  IsOptional, 
  IsPositive, 
  Max, 
  Min, 
} from "class-validator"

export enum EMaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
}

export enum EHouseOwnershipStatus {
  OWNED = 'owned',
  MORTGAGED = 'mortgaged'
}

class House {
  @IsNotEmpty()
  @IsEnum(EHouseOwnershipStatus)
  @ApiProperty({
    enum: ['owned', 'mortgaged']
  })
  ownershipStatus: EHouseOwnershipStatus
}

class Vehicle {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Vehicle: Invalid manufacturing year.' })
  year: number
}


export class CreateInsuranceDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0, { message: 'Age must be an integer equal or greater than 0' })
  age: number

  @IsNotEmpty()
  @IsInt()
  @Min(0, { message: 'Dependents must be an integer equal or greater than 0' })
  dependents: number
  
  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: House
  })
  house?: House
  
  @IsNotEmpty()
  @IsInt()
  @Min(0, { message: 'Income must be an integer equal or greater than 0' })
  income: number
  
  @IsNotEmpty()
  @IsEnum(EMaritalStatus)
  @ApiProperty({
    enum: ['single', 'married']
  })
  maritalStatus: EMaritalStatus
  
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsNumber({},{each: true})
  @Min(0, { each: true })
  @Max(1, { each: true })
  @ApiProperty({ example: [0, 1, 0] })
  riskQuestions: number[]
  
  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: Vehicle
  })
  vehicle?: Vehicle
}
