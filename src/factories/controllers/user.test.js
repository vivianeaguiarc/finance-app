// src/factories/controllers/user.test.js

import { GetUserByIdController } from '../../controllers/user/get-user-by-id.js'
import { CreateUserController } from '../../controllers/user/create-user.js'
import { UpdateUserController } from '../../controllers/user/update-user.js'
import { DeleteUserController } from '../../controllers/user/delete-user.js'
import { GetUserBalanceController } from '../../controllers/user/get-user-balance.js'

import {
    makeGetUserByIdController,
    makeCreateUserController,
    makeUpdateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
} from './user.js'

describe('User Controller Factory', () => {
    it('should return a valid GetUserByIdController instance', () => {
        const sut = makeGetUserByIdController()
        expect(sut).toBeInstanceOf(GetUserByIdController)
    })

    it('should return a valid CreateUserController instance', () => {
        const sut = makeCreateUserController()
        expect(sut).toBeInstanceOf(CreateUserController)
    })

    it('should return a valid UpdateUserController instance', () => {
        const sut = makeUpdateUserController()
        expect(sut).toBeInstanceOf(UpdateUserController)
    })

    it('should return a valid DeleteUserController instance', () => {
        const sut = makeDeleteUserController()
        expect(sut).toBeInstanceOf(DeleteUserController)
    })

    it('should return a valid GetUserBalanceController instance', () => {
        const sut = makeGetUserBalanceController()
        expect(sut).toBeInstanceOf(GetUserBalanceController)
    })
})
