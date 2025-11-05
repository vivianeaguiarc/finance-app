import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int()
        }
    }
    const makerSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)
        return { sut, getUserBalanceUseCase }
    }
    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }
    it('should return 200 on when getting user balance successfully', async () => {
        const { sut } = makerSut()
        const httpResponse = await sut.execute(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(typeof httpResponse.body).toBe('number')
    })
})
