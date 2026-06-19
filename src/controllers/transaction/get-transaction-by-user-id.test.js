import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction } from '../../tests/fixtures/transaction.js'

describe('Get Transaction By User Id Controller', () => {
    const from = '2023-01-01T00:00:00.000Z'
    const to = '2023-12-31T23:59:59.999Z'
    const userId = faker.string.uuid()

    class GetUserByIdUseCasesStub {
        async execute() {
            return { items: [transaction], total: 1 }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCasesStub()
        const sut = new GetTransactionByUserIdController(getUserByIdUseCase)
        return { sut, getUserByIdUseCase }
    }

    const baseHttpRequest = {
        userId,
        query: { from, to },
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sut } = makeSut()
        const response = await sut.execute(baseHttpRequest)
        expect(response.statusCode).toBe(200)
        expect(response.body.data).toEqual([transaction])
        expect(response.body.meta).toEqual({
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
        })
    })

    it('should return 400 when userId from auth is missing', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            query: { from, to },
        })
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when userId from auth is invalid', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            userId: 'invalid-id',
            query: { from, to },
        })
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when sortBy is invalid', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            userId,
            query: { sortBy: 'name' },
        })
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when limit exceeds maximum', async () => {
        const { sut } = makeSut()
        const response = await sut.execute({
            userId,
            query: { limit: 200 },
        })
        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())
        const response = await sut.execute(baseHttpRequest)
        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when GetUserByUseCase throws generic error', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())
        const response = await sut.execute(baseHttpRequest)
        expect(response.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with userId from auth token and parsed query', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, 'execute')
        await sut.execute(baseHttpRequest)
        expect(executeSpy).toHaveBeenCalledWith(
            userId,
            expect.objectContaining({
                page: 1,
                limit: 10,
                startDate: from,
                endDate: to,
            }),
        )
    })

    it('should ignore userId from query and use auth token userId', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, 'execute')
        const otherUserId = faker.string.uuid()

        await sut.execute({
            userId,
            query: { userId: otherUserId, from, to },
        })

        expect(executeSpy).toHaveBeenCalledWith(
            userId,
            expect.objectContaining({
                startDate: from,
                endDate: to,
            }),
        )
        expect(executeSpy).not.toHaveBeenCalledWith(otherUserId, expect.anything())
    })
})
