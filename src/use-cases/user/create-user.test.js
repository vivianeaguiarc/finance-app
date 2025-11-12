import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserUseCase } from './create-user.js'
import { user as fixtureUser } from '../../tests/fixtures/index.js'

describe('CreateUserUseCase', () => {
    const user = {
        ...fixtureUser,
        id: undefined,
    }
    const makeSut = () => {
        class GetuserByEmailRepositoryStub {
            async execute() {
                return null
            }
        }
        class CreateUserRepositoryStub {
            async execute() {
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
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValueOnce(user)

        const promise = sut.execute(user)
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })
    it('should call IdGeneratorAdapter to cryptograph password', async () => {
        const { sut, createUserRepository, user, idGeneratorAdapter } =
            makeSut()
        const idGeneratorSpy = import.meta.jest.spyOn(
            idGeneratorAdapter,
            'execute',
        )
        const createUserRepositorySpy = import.meta.jest.spyOn(
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

    it('should call PasswordAdapter to cryptograph password', async () => {
        const { sut, createUserRepository, user, passwordHasherAdapter } =
            makeSut()
        const passwordHasherSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const createUserRepositorySpy = import.meta.jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })
    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository, user } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user)
        await expect(promise).rejects.toThrow()
    })
    it('should throw if idGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter, user } = makeSut()
        import.meta.jest
            .spyOn(idGeneratorAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const promise = sut.execute(user)
        await expect(promise).rejects.toThrow()
    })
    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter, user } = makeSut()
        import.meta.jest
            .spyOn(passwordHasherAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const promise = sut.execute(user)
        await expect(promise).rejects.toThrow()
    })
    it('should throw if CreateUserRepository throws', async () => {
        const { sut, createUserRepository, user } = makeSut()
        import.meta.jest
            .spyOn(createUserRepository, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const promise = sut.execute(user)
        await expect(promise).rejects.toThrow()
    })
})
