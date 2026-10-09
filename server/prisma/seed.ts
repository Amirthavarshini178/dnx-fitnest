import bcrypt from 'bcryptjs'
import { prisma } from '../src/config/prisma.js'

async function main() {
  await prisma.supportTicket.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.dietPlan.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.workoutPlan.deleteMany()
  await prisma.exercise.deleteMany()
  await prisma.memberProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.trainer.deleteMany()
  await prisma.announcement.deleteMany()

  const passwordHash = await bcrypt.hash('Demo@123', 12)
  const users = Array.from({ length: 10 }, (_, index) => ({
    id: `member-${String(index + 1).padStart(3, '0')}`,
    email: index === 0 ? 'demo@dnxfitnest.com' : `member${index + 1}@dnxfitnest.com`,
    phone: `98765432${String(index + 10).slice(-2)}`,
    passwordHash,
    role: 'MEMBER' as const,
  }))
  await prisma.user.createMany({ data: users })

  const trainers = [
    ['trainer-1', 'Raj Kumar', 'Strength training, muscle building, weight loss'],
    ['trainer-2', 'Priya Sharma', 'Yoga, mobility, functional fitness'],
    ['trainer-3', 'Vikram Singh', 'Powerlifting, strength conditioning'],
    ['trainer-4', 'Ananya Rao', 'HIIT, cardio, weight management'],
    ['trainer-5', 'Kabir Mehta', 'Sports conditioning, athletic performance'],
  ]
  await prisma.trainer.createMany({ data: trainers.map(([id, name, specialization], index) => ({ id, name, email: `coach${index + 1}@dnxfitnest.com`, bio: `${name} helps members build sustainable strength through focused coaching and consistent progress.`, experienceYears: 4 + index, specializations: specialization.split(', '), availability: 'Monday to Saturday, 6:00 AM to 2:00 PM' })) })

  await prisma.memberProfile.createMany({ data: users.map((user, index) => ({ userId: user.id, fullName: index === 0 ? 'Arjun Kumar' : `Member ${index + 1}`, dateOfBirth: new Date(1995 + index, index % 12, 12), gender: index % 2 ? 'Female' : 'Male', address: 'Bengaluru, Karnataka', emergencyContactName: 'Family Contact', emergencyContactNumber: '9876500000', bloodGroup: ['O+', 'B+', 'A+', 'AB+'][index % 4], fitnessGoal: ['Build muscle', 'Improve fitness', 'Weight loss'][index % 3], trainerId: `trainer-${index % 5 + 1}` })) })

  const exerciseData = [
    ['Barbell Bench Press', 'CHEST', 'Barbell'], ['Incline Dumbbell Press', 'CHEST', 'Dumbbells'], ['Cable Fly', 'CHEST', 'Cable'], ['Push-up', 'CHEST', 'Bodyweight'],
    ['Lat Pulldown', 'BACK', 'Cable'], ['Seated Cable Row', 'BACK', 'Cable'], ['Romanian Deadlift', 'BACK', 'Barbell'],
    ['Dumbbell Shoulder Press', 'SHOULDERS', 'Dumbbells'], ['Lateral Raise', 'SHOULDERS', 'Dumbbells'], ['Face Pull', 'SHOULDERS', 'Cable'],
    ['Triceps Pushdown', 'ARMS', 'Cable'], ['Dumbbell Curl', 'ARMS', 'Dumbbells'], ['Overhead Triceps Extension', 'ARMS', 'Dumbbell'],
    ['Barbell Squat', 'LEGS', 'Barbell'], ['Leg Press', 'LEGS', 'Machine'], ['Walking Lunge', 'LEGS', 'Dumbbells'],
    ['Plank', 'CORE', 'Bodyweight'], ['Cable Crunch', 'CORE', 'Cable'], ['Treadmill Run', 'CARDIO', 'Treadmill'], ['Cycling', 'CARDIO', 'Bike'],
  ] as const
  await prisma.exercise.createMany({ data: exerciseData.map(([name, muscle, equipment], index) => ({ id: `exercise-${String(index + 1).padStart(2, '0')}`, name, muscle, equipment, difficulty: index % 3 === 0 ? 'BEGINNER' : 'INTERMEDIATE', instructions: `Use controlled movement, maintain good posture and stop if you feel pain.` })) })

  const checkInDates = Array.from({ length: 20 }, (_, index) => ({ userId: users[index % 2].id, checkIn: new Date(2026, 8, 1 + index, 7, 10), checkOut: new Date(2026, 8, 1 + index, 8, 28), status: 'PRESENT' as const }))
  await prisma.attendance.createMany({ data: checkInDates })

  const paymentData = Array.from({ length: 10 }, (_, index) => ({ id: `payment-${String(index + 1).padStart(2, '0')}`, userId: users[index].id, transactionId: `DNX-${2409000 + index}`, plan: index % 2 ? 'Quarterly' : 'Annual', amount: index % 2 ? 2000 : 6000, method: 'DEMO' as const, status: 'PAID' as const, createdAt: new Date(2026, 0, 1 + index) }))
  await prisma.payment.createMany({ data: paymentData })
  await prisma.membership.createMany({ data: users.map((user, index) => ({ userId: user.id, paymentId: paymentData[index].id, plan: index % 2 ? 'Quarterly' : 'Annual', status: 'ACTIVE' as const, startDate: new Date(2026, 0, 1), endDate: new Date(2026, 11, 31) })) })

  const workoutData = users.map((user, index) => ({ id: `workout-${String(index + 1).padStart(2, '0')}`, userId: user.id, name: ['Chest & Triceps', 'Back & Biceps', 'Leg Day', 'Shoulders & Core'][index % 4], day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'][index % 4] }))
  await prisma.workoutPlan.createMany({ data: workoutData })
  await prisma.workoutExercise.createMany({ data: workoutData.flatMap((plan, planIndex) => [0, 1, 2].map((offset) => ({ planId: plan.id, exerciseId: `exercise-${String((planIndex * 2 + offset) % 20 + 1).padStart(2, '0')}`, sets: 3 + offset % 2, reps: 10 + offset * 2, restSeconds: 60 + offset * 15 }))) })

  await prisma.dietPlan.createMany({ data: users.slice(0, 5).map((user, index) => ({ userId: user.id, title: 'Balanced strength day', calories: 2400, protein: 160, carbs: 280, fat: 70, meals: [{ name: 'Breakfast', food: 'Oats, banana and eggs', calories: 480 }, { name: 'Lunch', food: 'Grilled chicken rice bowl', calories: 620 }, { name: 'Dinner', food: 'Paneer, greens and quinoa', calories: 520 }], createdAt: new Date(2026, 8, 1 + index) })) })
  await prisma.progress.createMany({ data: users.map((user, index) => ({ userId: user.id, weight: 68 + index, height: 179, bodyFat: 18.4, chest: 102, waist: 82, arms: 35, thighs: 56, shoulders: 118, recordedAt: new Date(2026, 8, 1 + index) })) })
  await prisma.notification.createMany({ data: users.map((user, index) => ({ userId: user.id, type: (['WORKOUT', 'PAYMENT', 'ANNOUNCEMENT', 'MEMBERSHIP_EXPIRY'] as const)[index % 4], title: ['Your workout is ready', 'Payment received', 'New gym announcement', 'Membership update'][index % 4], message: 'Your DNX FITNEST account has a new update.' })) })
  await prisma.announcement.createMany({ data: Array.from({ length: 10 }, (_, index) => ({ title: ['Gym Maintenance Notice', 'New Zumba Batch Starting', 'September Workout Challenge'][index % 3], description: 'A new update from the DNX FITNEST team. See the front desk for more information.', category: ['FACILITY', 'CLASS', 'CHALLENGE'][index % 3], publishedAt: new Date(2026, 8, 1 + index) })) })
  await prisma.supportTicket.createMany({ data: users.slice(0, 5).map((user, index) => ({ userId: user.id, ticketNumber: `DNX-${10482 + index}`, subject: ['Membership question', 'Payment receipt', 'Attendance correction', 'Trainer session', 'App feedback'][index], category: (['MEMBERSHIP', 'PAYMENT', 'ATTENDANCE', 'TRAINER', 'TECHNICAL'] as const)[index], description: 'Please help me with this request. I can share more details if needed.', status: index === 0 ? 'OPEN' : 'RESOLVED' })) })

  console.info('Seed complete: 10 members, 5 trainers, 20 attendance records, 10 payments, 10 workouts, 20 exercises, 5 diets, 10 notifications, 10 announcements, 5 support tickets.')
  console.info('Demo login: demo@dnxfitnest.com / Demo@123')
}

main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(async () => { await prisma.$disconnect() })