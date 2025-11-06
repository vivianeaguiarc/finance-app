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
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }
    it('should successfully create a user', async () => {
        const { sut } = makeSut()
        const createdUser = await sut.execute({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        })
        expect(createdUser).toBeTruthy()
    })
})
