import { ArrowRight, Menu, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const items = [
  { label: 'Home', href: '/' }, { label: 'About', href: '/#about' }, { label: 'Membership', href: '/#plans' },
  { label: 'Trainers', href: '/#trainers' }, { label: 'Facilities', href: '/#facilities' }, { label: 'Programs', href: '/#programs' },
  { label: 'Gallery', href: '/#gallery' }, { label: 'Contact', href: '/#contact' },
]

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('Home')
  const visibleItems = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = items.slice(1).map((item) => ({ label: item.label, node: document.getElementById(item.href.split('#')[1]) })).filter((item) => item.node)
      const current = sections.find(({ node }) => node!.getBoundingClientRect().top > -140 && node!.getBoundingClientRect().top < window.innerHeight * 0.48)
      setActive(current?.label || 'Home')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  return <header className={`lux-nav ${scrolled ? 'is-scrolled' : ''}`}>
    <Link to="/" className="lux-brand" aria-label="DNX Fitnest home"><span className="lux-brand-mark">D</span><span>DNX <b>FITNEST</b></span></Link>
    <nav className={`lux-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
      {items.map((item) => <a href={item.href} key={item.label} className={active === item.label ? 'is-active' : ''} onClick={closeMenu}>{item.label}</a>)}
      <div className="mobile-nav-actions"><Link to="/login" onClick={closeMenu}>Member sign in</Link><Link to="/register" className="button button-gold" onClick={closeMenu}>Join now <ArrowRight size={15} /></Link></div>
    </nav>
    <div className="lux-nav-actions">
      <button className="lux-icon-button" type="button" aria-label={searchOpen ? 'Close search' : 'Search'} onClick={() => setSearchOpen(!searchOpen)}>{searchOpen ? <X size={17} /> : <Search size={17} />}</button>
      <Link to="/login" className="member-signin">Member sign in</Link>
      <Link to="/register" className="button button-gold nav-join">Join now <ArrowRight size={14} /></Link>
      <button className={`lux-menu-button ${menuOpen ? 'menu-open' : ''}`} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </div>
    {searchOpen && <div className="lux-search-panel"><label htmlFor="site-search">Find your way</label><input id="site-search" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus placeholder="Search sections" />{query && <div className="search-results">{visibleItems.map((item) => <a key={item.label} href={item.href} onClick={() => { setSearchOpen(false); setQuery('') }}>{item.label}<ArrowRight size={13} /></a>)}{visibleItems.length === 0 && <span>No matching sections</span>}</div>}</div>}
  </header>
}