import rateLimit from 'express-rate-limit'

const noopLimiter = (_req, _res, next) => next()

export const globalLimiter =
    process.env.NODE_ENV === 'test'
        ? noopLimiter
        : rateLimit({
              windowMs: 15 * 60 * 1000,
              max: 300,
              standardHeaders: true,
              legacyHeaders: false,
              message: {
                  message: 'Too many requests, please try again later.',
              },
          })

export const authLimiter =
    process.env.NODE_ENV === 'test'
        ? noopLimiter
        : rateLimit({
              windowMs: 15 * 60 * 1000,
              max: 20,
              standardHeaders: true,
              legacyHeaders: false,
              message: {
                  message:
                      'Too many authentication attempts, please try again later.',
              },
          })
