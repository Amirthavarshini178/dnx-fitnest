import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function createAccessToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, env.JWT_SECRET, { expiresIn: '15m' })
}

export function createRefreshToken(userId: string) {
  return jwt.sign({ sub: userId, type: 'refresh' }, env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
}