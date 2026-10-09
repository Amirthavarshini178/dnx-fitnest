import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { prisma } from './config/prisma.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { api } from './routes/index.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }))
app.use('/api', api)
app.use(notFound)
app.use(errorHandler)

const server = app.listen(env.PORT, () => console.info(`DNX FITNEST API listening on http://localhost:${env.PORT}`))
const shutdown = () => { server.close(() => { void prisma.$disconnect().finally(() => process.exit(0)) }) }
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)