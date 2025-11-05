import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user.js'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            }
        }
    }
    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)
        return {
            sut,
            updateUserUseCase,
        }
    }
    const httpRequest = {
        params: { userId: faker.string.uuid() }, // <- adicionar
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        },
    }
    it('should return 200 when updating a user successfully', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(httpRequest)
        expect(result.statusCode).toBe(200)
    })
})
