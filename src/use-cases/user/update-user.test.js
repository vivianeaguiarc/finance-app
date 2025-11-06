import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user.js'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }
    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }
    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            passwordHasherAdapter,
            updateUserRepository,
        }
    }
    it('should update user successfully (without email and password)', async () => {
        const { sut } = makeSut()
        const userId = faker.string.uuid()
        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        }

        const result = await sut.execute(userId, updateUserParams)

        expect(result).toBe(user)
    })
    it('should update user successfully (with email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )
        const email = faker.internet.email()
        const result = await sut.execute(faker.string.uuid(), { email })
        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
        expect(result).toBe(user)
    })

    it('should update user successfully (with password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const password = faker.internet.password({ length: 7 })
        const result = await sut.execute(faker.string.uuid(), { password })
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
        expect(result).toBe(user)
    })
})
