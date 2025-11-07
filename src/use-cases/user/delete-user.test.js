import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user.js'
import { user } from '../../tests/fixtures/index.js'

describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepository)
        return { sut, deleteUserRepository }
    }

    it('should successfully delete a user', async () => {
        const { sut } = makeSut()
        const deletedUser = await sut.execute(faker.string.uuid())
        expect(deletedUser).toEqual(user)
    })
    it('should call DeleteUserRepository with correct values', async () => {
        const { sut, deleteUserRepository } = makeSut()
        const deleteSpy = jest.spyOn(deleteUserRepository, 'execute')
        const userId = faker.string.uuid()
        await sut.execute(userId)
        expect(deleteSpy).toHaveBeenCalledWith(userId)
    })
    it('should throw if DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepository } = makeSut()
        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const promise = sut.execute(faker.string.uuid())
        await expect(promise).rejects.toThrow()
    })
})
