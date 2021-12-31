import { binding, then, when, before, given} from 'cucumber-tsflow'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../../../src/app.module'
import { assert } from 'chai'

class Context {
  public app
  public response
  public payload
}

// tslint:disable-next-line:max-classes-per-file
@binding([Context])
export class AutoInsuranceSteps {

  constructor(protected context: Context) {}

  @before()
  public async before(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    this.context.payload = {
      age: 35,
      dependents: 2,
      house: {
        ownershipStatus: 'owned'
      },
      income: 0,
      maritalStatus: 'married',
      riskQuestions: [0, 0, 0],
      vehicle: {
        year: 2018
      }
    }

    this.context.app = moduleFixture.createNestApplication()
    await this.context.app.init()
  }

  @given(`I don't hava a car`)
  public async payloadWithoutCar() {
    delete this.context.payload.vehicle
  }

  @when('I ask for my auto insurance plan')
  public async callToAPI() {
    this.context.response = await request(this.context.app.getHttpServer())
      .post('/insurance')
      .send(this.context.payload)
  }

  @then('I should be told {string}')
  public statusResponse(insurancePlan: string) {
    assert.equal(this.context.response.body.auto, insurancePlan)
  }

  @given(`I'm under 30 years old`)
  public async payloadUnder30YearsOld() {
    this.context.payload.age = 29
  }

}