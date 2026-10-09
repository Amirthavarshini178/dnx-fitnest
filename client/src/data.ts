import type { Exercise, Plan } from './types'

export const plans: Plan[] = [
  { name: 'Admission', price: 500, duration: 'One time', features: ['Member onboarding', 'Fitness assessment', 'Gym orientation'] },
  { name: 'Monthly', price: 800, duration: '1 month', features: ['Full gym access', 'Locker access', 'Monthly progress check'] },
  { name: 'Quarterly', price: 2000, duration: '3 months', features: ['Full gym access', '2 trainer sessions', 'Nutrition consultation'] },
  { name: 'Half Year', price: 3500, duration: '6 months', features: ['Full gym access', '6 trainer sessions', 'Body composition scans'] },
  { name: 'Annual', price: 6000, duration: '12 months', features: ['Unlimited gym access', '12 trainer sessions', 'Priority class booking'] },
  { name: 'Day Pass', price: 100, duration: '1 day', features: ['Single day access', 'All group classes', 'Complimentary towel'] },
]

export const exercises: Exercise[] = [
  { name: 'Barbell Bench Press', sets: 4, reps: 10, muscle: 'Chest', equipment: 'Barbell' }, { name: 'Incline Dumbbell Press', sets: 3, reps: 12, muscle: 'Chest', equipment: 'Dumbbells' }, { name: 'Cable Fly', sets: 3, reps: 15, muscle: 'Chest', equipment: 'Cable' },
  { name: 'Triceps Pushdown', sets: 3, reps: 12, muscle: 'Arms', equipment: 'Cable' }, { name: 'Overhead Triceps Extension', sets: 3, reps: 12, muscle: 'Arms', equipment: 'Dumbbell' }, { name: 'Dumbbell Curl', sets: 3, reps: 12, muscle: 'Arms', equipment: 'Dumbbells' },
  { name: 'Lat Pulldown', sets: 4, reps: 10, muscle: 'Back', equipment: 'Cable' }, { name: 'Seated Cable Row', sets: 3, reps: 12, muscle: 'Back', equipment: 'Cable' },
  { name: 'Dumbbell Shoulder Press', sets: 4, reps: 10, muscle: 'Shoulders', equipment: 'Dumbbells' }, { name: 'Lateral Raise', sets: 3, reps: 15, muscle: 'Shoulders', equipment: 'Dumbbells' }, { name: 'Face Pull', sets: 3, reps: 15, muscle: 'Shoulders', equipment: 'Cable' },
  { name: 'Barbell Squat', sets: 4, reps: 8, muscle: 'Legs', equipment: 'Barbell' }, { name: 'Romanian Deadlift', sets: 3, reps: 10, muscle: 'Legs', equipment: 'Barbell' }, { name: 'Leg Press', sets: 3, reps: 12, muscle: 'Legs', equipment: 'Machine' },
  { name: 'Plank', sets: 3, reps: 45, muscle: 'Core', equipment: 'Bodyweight' }, { name: 'Cable Crunch', sets: 3, reps: 15, muscle: 'Core', equipment: 'Cable' }, { name: 'Dead Bug', sets: 3, reps: 10, muscle: 'Core', equipment: 'Bodyweight' },
  { name: 'Treadmill Run', sets: 1, reps: 20, muscle: 'Cardio', equipment: 'Treadmill' }, { name: 'Cycling', sets: 1, reps: 25, muscle: 'Cardio', equipment: 'Bike' }, { name: 'Walking Lunge', sets: 3, reps: 12, muscle: 'Legs', equipment: 'Dumbbells' },
]