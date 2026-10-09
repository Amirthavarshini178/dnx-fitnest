import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Dumbbell } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../contexts/AuthContext'

const schema = z.object({
  fullName: z.string().optional(), phone: z.string().optional(), email: z.string().min(1, 'Enter your email or phone'), password: z.string().min(6, 'Use at least 6 characters'),
  confirmPassword: z.string().optional(), dateOfBirth: z.string().optional(), gender: z.string().optional(), address: z.string().optional(), emergencyContactName: z.string().optional(), emergencyContactNumber: z.string().optional(), bloodGroup: z.string().optional(),
})
const registrationSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'), phone: z.string().min(8, 'Enter a valid phone number'), email: z.string().email('Enter a valid email address'), password: z.string().min(8, 'Use at least 8 characters'), confirmPassword: z.string().min(8), dateOfBirth: z.string().min(1, 'Choose your date of birth'), gender: z.string().min(1, 'Choose an option'), address: z.string().min(5, 'Enter your address'), emergencyContactName: z.string().min(2, 'Enter an emergency contact'), emergencyContactNumber: z.string().min(8, 'Enter a valid contact number'), bloodGroup: z.string().min(1, 'Choose your blood group'),
}).refine((values) => values.password === values.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' })
type Values = z.infer<typeof schema>

export default function Login({ register = false }: { register?: boolean }) {
  const navigate = useNavigate()
  const { login, register: createAccount } = useAuth()
  const [formError, setFormError] = useState('')
  const { register: field, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: 'demo@dnxfitnest.com', password: 'Demo@123' } })
  const submit = handleSubmit(async (values) => {
    setFormError('')
    try {
      if (register) {
        const parsed = registrationSchema.safeParse(values)
        if (!parsed.success) { setFormError(parsed.error.issues[0]?.message || 'Check the registration details.'); return }
        const { confirmPassword: _confirmPassword, ...account } = parsed.data
        await createAccount(account)
      } else await login({ email: values.email, password: values.password })
      navigate('/dashboard')
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Unable to sign in right now.') }
  })
  return <main className="auth-page"><div className="auth-image"><div className="auth-brand"><Link to="/" className="brand"><span className="brand-mark">D</span><span>DNX<span className="brand-light">FITNEST</span></span></Link><span>TRAIN HARD. STAY STRONG. BECOME BETTER.</span></div><div className="auth-image-copy"><span>YOUR NEXT CHAPTER STARTS HERE</span><h1>Stronger<br />is a daily choice.</h1></div><small className="auth-image-note">The work you put in today becomes the strength you carry tomorrow.</small></div><section className="auth-form-side"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to DNX Fitnest</Link><div className="auth-form-wrap"><div className="auth-icon"><Dumbbell size={20} /></div><span className="eyebrow">{register ? 'BECOME A MEMBER' : 'WELCOME BACK'}</span><h2>{register ? 'Start your journey.' : 'Good to see you.'}</h2><p>{register ? 'Create your account and find your strongest self.' : 'Sign in and pick up where your last rep left off.'}</p><form onSubmit={submit} className="auth-form">
      {register && <><label>Full name<input autoComplete="name" {...field('fullName')} placeholder="Your full name" required /></label><label>Phone number<input type="tel" autoComplete="tel" {...field('phone')} placeholder="+91 98765 43210" required /></label></>}
      <label>{register ? 'Email address' : 'Email or phone'}<input type={register ? 'email' : 'text'} autoComplete="username" {...field('email')} placeholder={register ? 'you@example.com' : 'Email address or phone'} required />{errors.email && <small className="field-error">{errors.email.message}</small>}</label>
      <label>Password<input type="password" autoComplete={register ? 'new-password' : 'current-password'} {...field('password')} placeholder="Enter your password" required />{errors.password && <small className="field-error">{errors.password.message}</small>}</label>
      {register && <><label>Confirm password<input type="password" autoComplete="new-password" {...field('confirmPassword')} placeholder="Repeat your password" required /></label><label>Date of birth<input type="date" {...field('dateOfBirth')} required /></label><label>Gender<select defaultValue="" {...field('gender')} required><option value="" disabled>Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label><label>Address<input autoComplete="street-address" {...field('address')} placeholder="Street, city, state" required /></label><label>Emergency contact name<input {...field('emergencyContactName')} placeholder="Contact full name" required /></label><label>Emergency contact number<input type="tel" {...field('emergencyContactNumber')} placeholder="Phone number" required /></label><label>Blood group<select defaultValue="" {...field('bloodGroup')} required><option value="" disabled>Select blood group</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group}>{group}</option>)}</select></label><label>Profile photo<input type="file" accept="image/*" /></label></>}
      {!register && <div className="form-between"><label className="check-label"><input type="checkbox" defaultChecked /> Remember me</label><Link to="/forgot-password">Forgot password?</Link></div>}
      {formError && <small className="field-error" role="alert">{formError}</small>}<button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please waitâ€¦' : register ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button></form>
      {!register && <div className="demo-account"><span className="demo-label">DEMO ACCOUNT</span><strong>demo@dnxfitnest.com</strong><span>Password: Demo@123</span></div>}<p className="auth-switch">{register ? 'Already a member?' : 'New to DNX?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p></div></section></main>
}
