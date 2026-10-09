import { useState, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronLeft, ChevronRight, Dumbbell, Facebook, Instagram, MapPin, ShieldCheck, Sparkles, Star, Timer, Users, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { plans } from '../data'
import CountUpStat from '../components/CountUpStat'
import HeroVisual from '../components/HeroVisual'
import PublicNav from '../components/PublicNav'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

const gymPhoto = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=82'
const trainers = [
  { name: 'Raj Kumar', role: 'Certified Fitness Trainer', years: '7 years experience', photo: 'photo-1500648767791-00dcc994a43e', initials: 'RK', focus: 'Strength Â· Muscle building' },
  { name: 'Arun Prakash', role: 'Strength Coach', years: '6 years experience', photo: 'photo-1506794778202-cad84cf45f1d', initials: 'AP', focus: 'Power Â· Conditioning' },
  { name: 'Vignesh S', role: 'Fitness Coach', years: '5 years experience', photo: 'photo-1531384441138-2736e62e0919', initials: 'VS', focus: 'Functional Â· Mobility' },
  { name: 'Priya Devi', role: "Women's Fitness Coach", years: '5 years experience', photo: 'photo-1544005313-94ddf0286df2', initials: 'PD', focus: 'Strength Â· Wellness' },
]
const facilities = [
  { title: 'Strength Training Area', type: '01 / TRAIN WITH PURPOSE', image: gymPhoto, icon: Dumbbell, size: 'facility-large' },
  { title: 'Cardio Zone', type: '02 / FIND YOUR PACE', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80', icon: Timer },
  { title: 'Functional Training', type: '03 / MOVE BETTER', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', icon: Sparkles },
  { title: 'Free Weights', type: '04 / BUILT BY REPS', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80', icon: Dumbbell },
  { title: 'Locker Facilities', type: '05 / RESET & RECHARGE', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80', icon: ShieldCheck },
]
const programs = [
  { name: 'Strength Training', description: 'Build a strong foundation, one focused rep at a time.', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80', icon: Dumbbell },
  { name: 'Weight Loss', description: 'Sustainable coaching and movement that keeps you going.', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80', icon: ArrowUpRight },
  { name: 'Muscle Building', description: 'Progressive plans for strength, size and confidence.', image: gymPhoto, icon: BadgeCheck },
  { name: 'Functional Training', description: 'Move with control, power and more confidence every day.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', icon: Sparkles },
  { name: 'Personal Training', description: 'A coach in your corner, with a plan made around you.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80', icon: Users },
  { name: 'Cardio & Conditioning', description: 'Build your engine and bring a little more energy.', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80', icon: Timer },
]
const testimonials = [
  { quote: 'This is the first gym where I feel like I belong, and the first plan I could actually stick with.', name: 'Ananya S.', detail: 'MEMBER SINCE 2023 Â· STRENGTH TRAINING' },
  { quote: 'My coach helped me build a routine that fits real life. Six months later, I feel stronger in every way.', name: 'Karthik R.', detail: 'MEMBER SINCE 2024 Â· PERSONAL TRAINING' },
  { quote: 'Great equipment, great people, and a place that makes showing up feel easy.', name: 'Meera V.', detail: 'MEMBER SINCE 2022 Â· FUNCTIONAL FITNESS' },
]
const faqs = [
  ['What membership plans are available?', 'Choose from Admission, Monthly, Quarterly, Half Year, Annual and Day Pass options. Plans begin at â‚¹100 for a day pass.'],
  ['Do you provide personal training?', 'Yes. Our coaches offer one-to-one sessions and can build a program around your goals and experience.'],
  ['Can beginners join?', 'Absolutely. Beginners are welcome, and our trainers can help you feel comfortable with equipment and form.'],
  ['What are the gym timings?', 'Monday to Saturday: 5:00 AMâ€“12:00 PM and 3:00 PMâ€“10:00 PM. Sunday: 6:00 AMâ€“12:00 PM.'],
  ['Do you provide diet plans?', 'Nutrition guidance is available with selected memberships and personal training. Ask the team to find the right fit.'],
  ['Can I cancel my membership?', 'Contact the front desk or open a support ticket to review the terms for your current plan.'],
]

export default function PublicHome() {
  const [testimonial, setTestimonial] = useState(0)
  const [contactSent, setContactSent] = useState(false)
  const currentTestimonial = testimonials[testimonial]
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setContactSent(true)
    event.currentTarget.reset()
  }

  return <main className="public-page luxury-site" id="home">
    <PublicNav />
    <section className="lux-hero">
      <img className="lux-hero-photo" src={gymPhoto} alt="" aria-hidden="true" fetchPriority="high" />
      <div className="lux-hero-vignette" />
      <div className="lux-hero-copy">
        <span className="lux-eyebrow"><i /> A BETTER KIND OF STRONG</span>
        <h1>BUILD YOUR<br /><em>STRONGEST</em><br />SELF.</h1>
        <p>Train harder, stay consistent and transform your body with DNX FITNEST.</p>
        <div className="lux-hero-actions"><Link to="/register" className="button button-gold">JOIN NOW <ArrowRight size={16} /></Link><a className="button button-glass" href="#plans">EXPLORE MEMBERSHIPS <ArrowDown size={15} /></a></div>
        <span className="lux-location"><MapPin size={14} /> Thanjavur's modern fitness destination.</span>
      </div>
      <div className="hero-3d-wrap"><HeroVisual /><span className="hero-object-label">BUILT TO PERFORM <i>01 / 06</i></span></div>
      <span className="lux-hero-index">01 <i>/ 09</i> <b /></span>
      <a className="lux-scroll" href="#about">SCROLL TO EXPLORE <span /></a>
    </section>

    <Reveal className="stats-reveal"><section className="lux-stats" aria-label="DNX Fitnest in numbers">
      <CountUpStat value={2500} suffix="+" label="MEMBERS" icon={Users} />
      <CountUpStat value={25} suffix="+" label="TRAINERS" icon={BadgeCheck} delay={80} />
      <CountUpStat value={15} suffix="+" label="PROGRAMS" icon={Dumbbell} delay={150} />
      <CountUpStat value={8} suffix="+" label="YEARS EXPERIENCE" icon={Timer} delay={220} />
    </section></Reveal>

    <Reveal><section id="about" className="lux-about lux-section">
      <div className="lux-about-image"><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=82" alt="Strength training floor at DNX Fitnest" loading="lazy" /><span className="image-index">EST. 2018 <i>THANJAVUR, TN</i></span><div className="image-callout"><Dumbbell size={19} /><span>SHOW UP<br /><b>STRONGER</b></span></div></div>
      <div className="lux-about-copy"><span className="lux-kicker">OUR STORY <i>01</i></span><h2>BUILT FOR PEOPLE<br />WHO WANT <em>MORE.</em></h2><p className="about-lead">At DNX FITNEST, we believe fitness is more than just a workout. It is a lifestyle.</p><p>We make room for every starting point. With thoughtful coaching, modern equipment and a community that keeps showing up, you can build strength that follows you beyond the gym.</p><Link to="/about" className="lux-text-link">OUR APPROACH <ArrowRight size={15} /></Link>
        <div className="lux-feature-grid">{[['Professional Trainers', BadgeCheck], ['Modern Equipment', Dumbbell], ['Personalized Programs', Sparkles], ['Clean Environment', ShieldCheck]].map(([label, Icon]) => { const FeatureIcon = Icon as typeof BadgeCheck; return <div className="lux-feature" key={label as string}><FeatureIcon size={17} /><span>{label as string}</span></div> })}</div>
      </div>
    </section></Reveal>

    <Reveal><section id="plans" className="lux-plans lux-section">
      <div className="lux-section-heading"><div><span className="lux-kicker">MEMBERSHIPS <i>02</i></span><h2>CHOOSE YOUR<br /><em>FITNESS JOURNEY.</em></h2></div><p>Start where you are.<br />Weâ€™ll help with the next step.</p></div>
      <div className="lux-plan-grid">{plans.map((plan, index) => <TiltCard key={plan.name} className={`lux-plan-card ${plan.name === 'Annual' ? 'is-popular' : ''}`}><span className="plan-index">0{index + 1} <i>{plan.duration.toUpperCase()}</i></span>{plan.name === 'Annual' && <span className="lux-popular">MOST POPULAR</span>}<h3>{plan.name}</h3><div className="lux-price"><small>â‚¹</small>{plan.price.toLocaleString('en-IN')}<i>/{plan.duration === 'One time' ? 'once' : plan.duration === '12 months' ? 'year' : plan.duration.split(' ')[1] || 'day'}</i></div><ul>{plan.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul><Link to="/register" className={plan.name === 'Annual' ? 'button button-gold' : 'button button-plan'}>SELECT PLAN <ArrowRight size={14} /></Link></TiltCard>)}</div>
      <div className="lux-plan-foot"><span><ShieldCheck size={15} /> Clear pricing. No surprises.</span><Link to="/membership#plans">COMPARE PLANS <ArrowRight size={14} /></Link></div>
    </section></Reveal>

    <Reveal><section id="facilities" className="lux-facilities lux-section">
      <div className="lux-section-heading"><div><span className="lux-kicker">THE FITNEST <i>03</i></span><h2>PREMIUM FACILITIES<br /><em>FOR A BETTER YOU.</em></h2></div><p>Every detail designed to make<br />your time here count.</p></div>
      <div className="lux-facility-grid">{facilities.map(({ title, type, image, icon: Icon, size }) => <article className={`lux-facility-card ${size || ''}`} key={title}><img src={image} alt={title} loading="lazy" /><div className="facility-shade" /><Icon size={20} /><span className="facility-type">{type}</span><h3>{title}</h3><ArrowUpRight className="facility-arrow" size={17} /></article>)}</div>
    </section></Reveal>

    <Reveal><section id="trainers" className="lux-trainers lux-section">
      <div className="lux-section-heading"><div><span className="lux-kicker">IN YOUR CORNER <i>04</i></span><h2>GOOD COACHES.<br /><em>REAL PROGRESS.</em></h2></div><Link to="/trainers" className="lux-text-link">MEET THE TEAM <ArrowRight size={15} /></Link></div>
      <div className="lux-trainer-grid">{trainers.map((trainer, index) => <TiltCard className="lux-trainer-card" key={trainer.name}><div className="trainer-image"><img src={`https://images.unsplash.com/${trainer.photo}?auto=format&fit=crop&w=720&q=82`} alt={trainer.name} loading="lazy" /><span>0{index + 1}</span><div className="trainer-reveal"><small>{trainer.focus}</small><Link to="/trainer" aria-label={`View ${trainer.name}`}><ArrowUpRight size={18} /></Link></div></div><div className="trainer-card-copy"><div><h3>{trainer.name}</h3><p>{trainer.role}</p></div><span>{trainer.years}</span></div></TiltCard>)}</div>
    </section></Reveal>

    <Reveal><section id="programs" className="lux-programs lux-section">
      <div className="lux-section-heading"><div><span className="lux-kicker">MOVE YOUR WAY <i>05</i></span><h2>FIND YOUR<br /><em>STRONG.</em></h2></div><p>Six ways to build momentum.<br />One place to start.</p></div>
      <div className="lux-program-grid">{programs.map(({ name, description, image, icon: Icon }, index) => <TiltCard className="lux-program-card" key={name}><img src={image} alt="" loading="lazy" /><div className="program-shade" /><span className="program-number">0{index + 1}</span><Icon size={20} /><div className="program-card-copy"><h3>{name}</h3><p>{description}</p><Link to="/programs">EXPLORE <ArrowRight size={13} /></Link></div></TiltCard>)}</div>
    </section></Reveal>

    <Reveal><section className="lux-testimonials lux-section"><div className="lux-testimonial-top"><span className="lux-kicker">FROM THE FITNEST <i>06</i></span><div className="testimonial-controls"><button type="button" aria-label="Previous testimonial" onClick={() => setTestimonial((testimonial + testimonials.length - 1) % testimonials.length)}><ChevronLeft size={17} /></button><button type="button" aria-label="Next testimonial" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)}><ChevronRight size={17} /></button></div></div><div className="lux-testimonial-content" key={currentTestimonial.name}><span className="quote-mark">â€œ</span><div><div className="gold-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill="currentColor" />)}</div><blockquote>{currentTestimonial.quote}</blockquote><div className="testimonial-person"><span>{currentTestimonial.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{currentTestimonial.name}</strong><small>{currentTestimonial.detail}</small></div></div></div><span className="testimonial-count">0{testimonial + 1}<i> / 03</i></span></div></section></Reveal>

    <Reveal><section id="gallery" className="lux-gallery lux-section"><div className="lux-section-heading"><div><span className="lux-kicker">INSIDE DNX <i>07</i></span><h2>THE WORK.<br /><em>THE PEOPLE.</em></h2></div><Link to="/gallery" className="lux-text-link">VIEW GALLERY <ArrowRight size={15} /></Link></div><div className="lux-gallery-grid"><figure className="gallery-wide"><img src={gymPhoto} alt="DNX Fitnest training floor" loading="lazy" /><figcaption>STRENGTH FLOOR</figcaption></figure><figure><img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80" alt="Free weights and training equipment" loading="lazy" /><figcaption>BUILT BY REPS</figcaption></figure><figure><img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80" alt="Functional fitness class" loading="lazy" /><figcaption>MOVE TOGETHER</figcaption></figure><figure><img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80" alt="Cardio conditioning" loading="lazy" /><figcaption>FIND YOUR PACE</figcaption></figure></div></section></Reveal>

    <Reveal><section id="faq" className="lux-faq lux-section"><div className="lux-faq-heading"><span className="lux-kicker">THE DETAILS <i>08</i></span><h2>GOOD QUESTIONS.<br /><em>CLEAR ANSWERS.</em></h2><p>Still curious? Our team is happy to help.</p><a href="#contact" className="lux-text-link">TALK TO OUR TEAM <ArrowRight size={14} /></a></div><div className="lux-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>0{index + 1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></section></Reveal>

    <Reveal><section className="lux-contact lux-section" id="contact"><div className="lux-contact-info"><span className="lux-kicker">COME SEE US <i>09</i></span><h2>YOUR NEXT REP<br />STARTS <em>HERE.</em></h2><p>DNX FITNEST<br />Thanjavur, Tamil Nadu, India</p><a href="tel:+919876543210">+91 98765 43210 <ArrowUpRight size={15} /></a><a href="mailto:support@dnxfitnest.com">support@dnxfitnest.com <ArrowUpRight size={15} /></a><div className="opening-hours"><strong>OPENING HOURS</strong><span>MONDAYâ€“SATURDAY <i>5:00 AMâ€“12:00 PM Â· 3:00 PMâ€“10:00 PM</i></span><span>SUNDAY <i>6:00 AMâ€“12:00 PM</i></span></div></div><form className="lux-contact-form" onSubmit={submitContact}><span className="lux-kicker">LETâ€™S GET STARTED</span><div className="contact-form-grid"><label>Name<input required name="name" placeholder="Your name" autoComplete="name" /></label><label>Email<input required name="email" type="email" placeholder="you@example.com" autoComplete="email" /></label><label>Phone<input required name="phone" type="tel" placeholder="+91" autoComplete="tel" /></label><label>Subject<select name="subject" defaultValue=""><option value="" disabled>Select a topic</option><option>Membership</option><option>Personal training</option><option>General question</option></select></label><label className="message-field">Message<textarea required name="message" rows={3} placeholder="How can we help?" /></label></div><button className="button button-gold" type="submit">SEND MESSAGE <ArrowRight size={15} /></button>{contactSent && <span className="contact-success" role="status">Thanks for reaching out. Our team will be in touch.</span>}</form></section></Reveal>

    <footer className="lux-footer"><div className="lux-footer-main"><div className="lux-footer-brand"><Link to="/" className="lux-brand"><span className="lux-brand-mark">D</span><span>DNX <b>FITNEST</b></span></Link><p>Train Hard. Stay Strong.<br />Become Better.</p><div className="social-links"><a href="https://instagram.com" aria-label="Instagram"><Instagram size={16} /></a><a href="https://facebook.com" aria-label="Facebook"><Facebook size={16} /></a><a href="https://youtube.com" aria-label="YouTube"><Youtube size={16} /></a></div></div><div className="footer-column"><strong>EXPLORE</strong><a href="/#about">About</a><a href="/#facilities">Facilities</a><a href="/#gallery">Gallery</a><a href="/#contact">Contact</a></div><div className="footer-column"><strong>TRAIN WITH US</strong><a href="/#plans">Membership</a><a href="/#programs">Programs</a><a href="/#trainers">Trainers</a><Link to="/register">Join DNX</Link></div><div className="footer-signoff"><span>THANJAVUR, TAMIL NADU</span><strong>STRONGER<br /><em>STARTS HERE.</em></strong><a href="tel:+919876543210">+91 98765 43210</a></div></div><div className="lux-footer-bottom"><span>Â© 2026 DNX FITNEST</span><span>TRAIN HARD. STAY STRONG. BECOME BETTER.</span><Link to="/login">MEMBER SIGN IN <ArrowRight size={12} /></Link></div></footer>
  </main>
}
