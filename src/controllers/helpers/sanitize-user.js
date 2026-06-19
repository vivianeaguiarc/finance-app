export function sanitizeUser(user) {
    if (!user) return user

    const { password, ...safeUser } = user
    return safeUser
}

export function sanitizeUserWithTokens(userWithTokens) {
    if (!userWithTokens) return userWithTokens

    const { password, tokens, ...safeUser } = userWithTokens
    return { ...safeUser, tokens }
}
