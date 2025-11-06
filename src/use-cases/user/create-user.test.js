import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserUseCase } from './create-user.js'
import { faker } from '@faker-js/faker'

describe('CreateUserUseCase', () => {
    const makeSut = () => {
        class GetuserByEmailRepositoryStub {
            async execute() {
                return null
            }
        }
        class CreateUserRepositoryStub {
            async execute(user) {
                return user
            }
        }
        class PasswordHasherAdapterStub {
            async execute() {
                return 'hashed_password'
            }
        }
        class IdGeneratorAdapterStub {
            execute() {
                return 'generated_id'
            }
        }

        const user = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }

        const getUserByEmailRepository = new GetuserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )
        return {
            sut,
            user,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    it('should successfully create a user', async () => {
        const { sut, user } = makeSut()
        const createdUser = await sut.execute(user)
        expect(createdUser).toBeTruthy()
    })

    it('should throw EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRepository, user } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            user,
        )

        const promise = sut.execute(user)
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })
    it('should call IdGeneratorAdapter to cryptograph password', async () => {
        const { sut, createUserRepository, user, idGeneratorAdapter } =
            makeSut()
        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })
})
