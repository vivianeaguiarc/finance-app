import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

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
            user,
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
    it('shold throw if email is already in use', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            user,
        )
        const promise = sut.execute(faker.string.uuid(), { email: user.email })
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })
    it('should call UpdateUserRepository with hashed password when provided', async () => {
        const { sut, updateUserRepository, user } = makeSut()
        const spy = jest.spyOn(updateUserRepository, 'execute')
        const updateParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: user.email,
            password: user.password,
        }

        await sut.execute(user.id, updateParams)

        expect(spy).toHaveBeenCalledWith(user.id, {
            ...updateParams,
            password: 'hashed_password',
        })
    })
    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const promise = sut.execute(faker.string.uuid(), {
            email: faker.internet.email(),
        })
        await expect(promise).rejects.toThrow()
    })
    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const promise = sut.execute(faker.string.uuid(), {
            password: faker.internet.password({ length: 7 }),
        })
        await expect(promise).rejects.toThrow()
    })
    it('should throw if UpdateUserRepository throws', async () => {
        const { sut, updateUserRepository } = makeSut()
        jest.spyOn(updateUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const promise = sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        })
        await expect(promise).rejects.toThrow()
    })
})
