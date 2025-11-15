import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserUseCase {
    constructor(
        getUserByEmailRepository,
        passwordComparator,
        tokensGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparator = passwordComparator
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }
    async execute(email, password) {
        // Verificar se 0 e-mail e a senha são válidos (se ha usuario com essas credenciais)
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError()
        }
        // Verificar se a senha recebida é valida
        const isPassowrdValid = await this.passwordComparator.execute(
            password,
            user.password,
        )
        if (!isPassowrdValid) {
            throw new InvalidPasswordError()
        }
        // Gerar um token de autenticação
        return {
            ...user,
            tokens: this.tokensGeneratorAdapter.execute(user.id),
        }
    }
}
