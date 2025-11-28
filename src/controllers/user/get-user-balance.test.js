import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return {
                earnings: 10000,
                expenses: 2000,
                investments: 3000,
                balance: 5000,
                earningsPercent: 62.5,
                expensesPercent: 12.5,
                investmentsPercent: 25,
            }
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
        query: {
            from: '2023-01-01',
            to: '2023-12-31',
        },
    }

    it('should return 200 when getting user balance successfully', async () => {
        const { sut } = makerSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)

        // ✔️ Ajustado para refletir retorno real do controller
        expect(httpResponse.body).toEqual({
            earnings: 10000,
            expenses: 2000,
            investments: 3000,
            balance: 5000,
            earningsPercent: 62.5,
            expensesPercent: 12.5,
            investmentsPercent: 25,
        })
    })

    it('should return 400 if id is invalid', async () => {
        const { sut } = makerSut()

        const result = await sut.execute({
            params: { userId: 'invalid_id' },
            query: {
                from: '2023-01-01',
                to: '2023-12-31',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        const { sut, getUserBalanceUseCase } = makerSut()

        import.meta.jest
            .spyOn(getUserBalanceUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserBalanceUseCase with correct values', async () => {
        const { sut, getUserBalanceUseCase } = makerSut()

        const executeSpy = import.meta.jest.spyOn(
            getUserBalanceUseCase,
            'execute',
        )

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.query.from,
            httpRequest.query.to,
        )
    })

    it('should return 404 if GetUserBalanceUseCase throws UserNotFoundError', async () => {
        const { sut, getUserBalanceUseCase } = makerSut()

        import.meta.jest
            .spyOn(getUserBalanceUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })
})
