import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserUseCase {
    constructor(
        getUserByEmailRepository,
        passwordComparator,
        authTokenService,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparator = passwordComparator
        this.authTokenService = authTokenService
    }
    async execute(email, password) {
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError()
        }

        const isPassowrdValid = await this.passwordComparator.execute(
            password,
            user.password,
        )
        if (!isPassowrdValid) {
            throw new InvalidPasswordError()
        }

        const tokens = await this.authTokenService.issueTokens(user.id)

        return {
            ...user,
            tokens,
        }
    }
}
