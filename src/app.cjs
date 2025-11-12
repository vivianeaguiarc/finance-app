// import express from 'express'
// import { usersRouter, transactionsRouter } from './routes/index.js'
// import swaggwerUi from 'swagger-ui-express'
// import fs from 'fs'
// import path from 'path'

// export const app = express()
// app.use(express.json())

// app.use('/api/users', usersRouter)
// app.use('/api/transactions', transactionsRouter)

// const swaggerDocument = JSON.parse(
//     fs.readFileSync(
//         path.join(import.meta.dirname, '../docs/swagger.json'),
//         'utf-8',
//     ),
// )

// app.use('/docs', swaggwerUi.serve, swaggwerUi.setup(swaggerDocument))
// src/app.cjs (CommonJS)
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const path = require('path')

async function createApp() {
  const { usersRouter, transactionsRouter } = await import('./routes/index.js')
  const app = express()
  app.use(express.json())

  app.use('/api/users', usersRouter)
  app.use('/api/transactions', transactionsRouter)

  const swaggerPath = path.join(__dirname, '../docs/swagger.json')
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  return app
}

module.exports = { createApp }
