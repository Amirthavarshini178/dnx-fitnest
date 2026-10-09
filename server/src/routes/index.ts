import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { createAccessToken, createRefreshToken } from '../utils/tokens.js'
import { createCheckoutSession, verifyCheckoutSignature } from '../services/paymentService.js'

export const api = Router()
const asyncRoute = (handler: (req: AuthRequest, res: import('express').Response) => Promise<unknown>) => (req: AuthRequest, res: import('express').Response, next: import('express').NextFunction) => { void handler(req, res).catch(next) }
const registration = z.object({ fullName: z.string().min(2), email: z.string().email(), phone: z.string().min(8), password: z.string().min(8), dateOfBirth: z.string().optional(), gender: z.string().optional(), address: z.string().optional(), emergencyContactName: z.string().optional(), emergencyContactNumber: z.string().optional(), bloodGroup: z.string().optional() })
const plans = [{ name: 'Admission', amount: 500, durationDays: 0 }, { name: 'Monthly', amount: 800, durationDays: 30 }, { name: 'Quarterly', amount: 2000, durationDays: 90 }, { name: 'Half Year', amount: 3500, durationDays: 180 }, { name: 'Annual', amount: 6000, durationDays: 365 }, { name: 'Day Pass', amount: 100, durationDays: 1 }]

api.get('/health', (_req, res) => res.json({ status: 'ok', service: 'DNX FITNEST API' }))
api.post('/auth/register', asyncRoute(async (req, res) => {
  const input = registration.parse(req.body)
  const email = input.email.toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' })
  const passwordHash = await bcrypt.hash(input.password, 12)
  const user = await prisma.user.create({ data: { email, phone: input.phone, passwordHash, role: 'MEMBER', profile: { create: { fullName: input.fullName, dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined, gender: input.gender, address: input.address, emergencyContactName: input.emergencyContactName, emergencyContactNumber: input.emergencyContactNumber, bloodGroup: input.bloodGroup } } } })
  res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, accessToken: createAccessToken(user.id, user.role), refreshToken: createRefreshToken(user.id) })
}))
api.post('/auth/login', asyncRoute(async (req, res) => {
  const input = z.object({ identifier: z.string().min(1), password: z.string().min(1) }).parse(req.body)
  const user = await prisma.user.findFirst({ where: { OR: [{ email: input.identifier.toLowerCase() }, { phone: input.identifier }] } })
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect' })
  res.json({ user: { id: user.id, email: user.email, role: user.role }, accessToken: createAccessToken(user.id, user.role), refreshToken: createRefreshToken(user.id) })
}))
api.post('/auth/refresh', asyncRoute(async (req, res) => {
  const token = z.string().min(1).parse(req.body.refreshToken)
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload
  if (typeof payload.sub !== 'string' || payload.type !== 'refresh') return res.status(401).json({ error: 'Invalid refresh token' })
  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user) return res.status(401).json({ error: 'Account not found' })
  res.json({ accessToken: createAccessToken(user.id, user.role), refreshToken: createRefreshToken(user.id) })
}))
api.post('/auth/forgot-password', (_req, res) => res.json({ message: 'If that account exists, reset instructions will be sent.' }))
api.post('/auth/reset-password', (_req, res) => res.status(501).json({ error: 'Configure an email provider to enable password reset delivery.' }))

api.get('/member/profile', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.memberProfile.findUnique({ where: { userId: req.user!.id }, include: { user: { select: { email: true, phone: true } } } }))))
api.put('/member/profile', requireAuth, asyncRoute(async (req, res) => { const input = z.object({ fullName: z.string().min(2).optional(), phone: z.string().min(8).optional(), address: z.string().optional(), emergencyContactName: z.string().optional(), emergencyContactNumber: z.string().optional(), bloodGroup: z.string().optional(), fitnessGoal: z.string().optional() }).parse(req.body); const { phone, ...profile } = input; if (phone) await prisma.user.update({ where: { id: req.user!.id }, data: { phone } }); res.json(await prisma.memberProfile.update({ where: { userId: req.user!.id }, data: profile })) }))
api.get('/member/dashboard', requireAuth, asyncRoute(async (req, res) => { const userId = req.user!.id; const [profile, membership, attendance, workouts, payments] = await Promise.all([prisma.memberProfile.findUnique({ where: { userId } }), prisma.membership.findFirst({ where: { userId, status: 'ACTIVE' }, orderBy: { endDate: 'desc' } }), prisma.attendance.count({ where: { userId, status: 'PRESENT' } }), prisma.workoutPlan.count({ where: { userId } }), prisma.payment.findMany({ where: { userId }, take: 5, orderBy: { createdAt: 'desc' } })]); res.json({ profile, membership, attendance, workouts, recentPayments: payments }) }))

api.get('/membership/plans', (_req, res) => res.json(plans))
api.get('/membership', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.membership.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } }))))
api.post('/membership/select', requireAuth, asyncRoute(async (req, res) => {
  const input = z.object({ plan: z.enum(['Admission', 'Monthly', 'Quarterly', 'Half Year', 'Annual', 'Day Pass']) }).parse(req.body)
  const plan = plans.find((item) => item.name === input.plan)!
  const checkout = await createCheckoutSession(plan, req.user!.id)
  const payment = await prisma.payment.create({ data: { userId: req.user!.id, transactionId: checkout.orderId, plan: plan.name, amount: plan.amount, method: checkout.mode === 'demo' ? 'DEMO' : 'RAZORPAY', status: checkout.mode === 'demo' ? 'PAID' : 'PENDING' } })
  if (checkout.mode === 'razorpay') return res.status(201).json({ payment, checkout, membership: null })
  const startDate = new Date()
  const membership = await prisma.membership.create({ data: { userId: req.user!.id, plan: plan.name, status: 'ACTIVE', startDate, endDate: new Date(startDate.getTime() + plan.durationDays * 86400000), paymentId: payment.id } })
  res.status(201).json({ payment, membership, checkout })
}))
api.get('/payments', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.payment.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } }))))
api.post('/payments/create', requireAuth, asyncRoute(async (req, res) => { const input = z.object({ plan: z.string() }).parse(req.body); const plan = plans.find((item) => item.name === input.plan); if (!plan) return res.status(404).json({ error: 'Membership plan not found' }); res.status(201).json({ plan, checkout: await createCheckoutSession(plan, req.user!.id) }) }))
api.post('/payments/verify', requireAuth, asyncRoute(async (req, res) => {
  const input = z.object({ orderId: z.string().min(1), paymentId: z.string().min(1), signature: z.string().min(1) }).parse(req.body)
  if (!verifyCheckoutSignature(input.orderId, input.paymentId, input.signature)) return res.status(400).json({ error: 'Payment signature is invalid' })
  const payment = await prisma.payment.findFirst({ where: { transactionId: input.orderId, userId: req.user!.id, method: 'RAZORPAY', status: 'PENDING' } })
  if (!payment) return res.status(404).json({ error: 'Pending payment not found' })
  const updatedPayment = await prisma.payment.update({ where: { id: payment.id }, data: { status: 'PAID', transactionId: input.paymentId } })
  const plan = plans.find((item) => item.name === payment.plan)!
  const startDate = new Date()
  const membership = await prisma.membership.create({ data: { userId: req.user!.id, plan: plan.name, status: 'ACTIVE', startDate, endDate: new Date(startDate.getTime() + plan.durationDays * 86400000), paymentId: payment.id } })
  res.json({ payment: updatedPayment, membership })
}))

api.get('/attendance', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.attendance.findMany({ where: { userId: req.user!.id }, orderBy: { checkIn: 'desc' } }))))
api.post('/attendance/check-in', requireAuth, asyncRoute(async (req, res) => { const existing = await prisma.attendance.findFirst({ where: { userId: req.user!.id, checkIn: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }); if (existing) return res.status(409).json({ error: 'Attendance already marked for today' }); res.status(201).json(await prisma.attendance.create({ data: { userId: req.user!.id, status: 'PRESENT' } })) }))
api.post('/attendance/check-out', requireAuth, asyncRoute(async (req, res) => { const attendance = await prisma.attendance.findFirst({ where: { userId: req.user!.id, checkOut: null }, orderBy: { checkIn: 'desc' } }); if (!attendance) return res.status(404).json({ error: 'No open check-in found' }); res.json(await prisma.attendance.update({ where: { id: attendance.id }, data: { checkOut: new Date() } })) }))

api.get('/workouts', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.workoutPlan.findMany({ where: { userId: req.user!.id }, include: { exercises: true }, orderBy: { createdAt: 'desc' } }))))
api.get('/workouts/today', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.workoutPlan.findFirst({ where: { userId: req.user!.id }, include: { exercises: true }, orderBy: { createdAt: 'desc' } }))))
api.put('/workouts/:id/complete', requireAuth, asyncRoute(async (req, res) => { const input = z.object({ completed: z.boolean() }).parse(req.body); const exercise = await prisma.workoutExercise.findFirst({ where: { id: String(req.params.id), plan: { userId: req.user!.id } } }); if (!exercise) return res.status(404).json({ error: 'Workout exercise not found' }); res.json(await prisma.workoutExercise.update({ where: { id: exercise.id }, data: { completed: input.completed } })) }))
api.get('/exercises', asyncRoute(async (req, res) => { const muscle = typeof req.query.muscle === 'string' ? req.query.muscle : undefined; const q = typeof req.query.q === 'string' ? req.query.q : undefined; res.json(await prisma.exercise.findMany({ where: { ...(muscle ? { muscle: muscle as never } : {}), ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}) }, orderBy: { name: 'asc' } })) }))
api.get('/diet', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.dietPlan.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } }))))
api.get('/progress', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.progress.findMany({ where: { userId: req.user!.id }, orderBy: { recordedAt: 'asc' } }))))
api.post('/progress', requireAuth, asyncRoute(async (req, res) => { const input = z.object({ weight: z.number().positive(), height: z.number().positive().optional(), bodyFat: z.number().min(0).max(100).optional(), chest: z.number().positive().optional(), waist: z.number().positive().optional(), arms: z.number().positive().optional(), thighs: z.number().positive().optional(), shoulders: z.number().positive().optional() }).parse(req.body); res.status(201).json(await prisma.progress.create({ data: { userId: req.user!.id, ...input } })) }))
api.get('/trainer', requireAuth, asyncRoute(async (req, res) => { const profile = await prisma.memberProfile.findUnique({ where: { userId: req.user!.id }, include: { trainer: true } }); res.json(profile?.trainer || null) }))
api.get('/notifications', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } }))))
api.put('/notifications/:id/read', requireAuth, asyncRoute(async (req, res) => { const result = await prisma.notification.updateMany({ where: { id: String(req.params.id), userId: req.user!.id }, data: { readAt: new Date() } }); if (!result.count) return res.status(404).json({ error: 'Notification not found' }); res.json({ success: true }) }))
api.get('/announcements', requireAuth, asyncRoute(async (_req, res) => res.json(await prisma.announcement.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' } }))))
api.get('/support/tickets', requireAuth, asyncRoute(async (req, res) => res.json(await prisma.supportTicket.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } }))))
api.post('/support/tickets', requireAuth, asyncRoute(async (req, res) => { const input = z.object({ subject: z.string().min(4), category: z.enum(['GENERAL', 'PAYMENT', 'MEMBERSHIP', 'ATTENDANCE', 'TECHNICAL', 'TRAINER', 'OTHER']), description: z.string().min(10), attachmentUrl: z.string().url().optional() }).parse(req.body); res.status(201).json(await prisma.supportTicket.create({ data: { ...input, ticketNumber: `DNX-${Math.floor(10000 + Math.random() * 89999)}`, userId: req.user!.id } })) }))
api.get('/support/tickets/:id', requireAuth, asyncRoute(async (req, res) => { const ticket = await prisma.supportTicket.findFirst({ where: { id: String(req.params.id), userId: req.user!.id } }); if (!ticket) return res.status(404).json({ error: 'Ticket not found' }); res.json(ticket) }))