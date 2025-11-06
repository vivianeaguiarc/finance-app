import { GetUserByIdUseCase } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'

describe('Get User By ID Use Case', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)
        return {
            sut,
            getUserByIdRepository,
        }
    }
    it('should get user by id successfully', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(faker.string.uuid())
        expect(result).toEqual(user)
    })
    it('should call GetUserByIdRepository with correct values', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
        const userId = faker.string.uuid()
        await sut.execute(userId)
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
