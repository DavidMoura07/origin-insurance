export enum InsurancePlans {
  ECONOMIC = 'economic',
  REGULAR = 'regular',
  RESPONSIBLE = 'responsible',
  INELIGIBLE = 'ineligible',
}

export class InsurancePackageDto {
  auto: InsurancePlans
  disability: InsurancePlans
  home: InsurancePlans
  life: InsurancePlans
}