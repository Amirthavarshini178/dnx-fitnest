import { Activity, Bell, CalendarCheck, ChartNoAxesCombined, CircleHelp, Dumbbell, LayoutDashboard, LogOut, Menu, Salad, Settings, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const links = [{ label: 'Overview', to: '/dashboard', icon: LayoutDashboard }, { label: 'Attendance', to: '/attendance', icon: CalendarCheck }, { label: 'Workout', to: '/workout', icon: Dumbbell }, { label: 'Membership', to: '/membership', icon: Activity }, { label: 'Progress', to: '/progress', icon: ChartNoAxesCombined }, { label: 'Nutrition', to: '/diet', icon: Salad }, { label: 'Profile', to: '/profile', icon: UserRound }]
const more = ['exercises', 'measurements', 'trainer', 'payments', 'notifications', 'announcements', 'support', 'settings']

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()
  const guard = (to: string) => (event: React.MouseEvent) => { event.preventDefault(); navigate(to); setOpen(false) }
  return <div className="app-shell"><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
    <div className="brand"><span className="brand-mark">D</span><span>DNX<span className="brand-light">FITNEST</span></span><button className="icon-button close-menu" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
    <p className="nav-caption">MEMBER SPACE</p><nav>{links.map(({ label, to, icon: Icon }) => <NavLink onClick={guard(to)} key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
    <p className="nav-caption secondary-caption">YOUR FITNESS</p><nav>{more.map((page) => <NavLink onClick={guard(`/${page}`)} key={page} to={`/${page}`} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Activity size={18} /><span>{page[0].toUpperCase() + page.slice(1)}</span></NavLink>)}</nav>
    <div className="sidebar-bottom"><div className="mini-avatar">AK</div><div className="member-name"><strong>Arjun Kumar</strong><small>Annual member</small></div><button className="icon-button" aria-label="Log out" onClick={() => { logout(); navigate('/login') }}><LogOut size={17} /></button></div>
  </aside>{open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close navigation" />}
  <main className="main-area"><header className="topbar"><button className="icon-button mobile-menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button><div className="breadcrumbs">MEMBER SPACE <span>/</span> <strong>YOUR FITNESS, IN FOCUS</strong></div><div className="top-actions"><span className="status-pill"><i /> Membership active</span><NavLink to="/notifications" onClick={guard('/notifications')} className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><b /></NavLink><div className="top-avatar">AK</div></div></header><div className="page-content"><Outlet /></div><footer className="app-footer"><span>DNX FITNEST <span className="footer-dot">/</span> Train hard. Stay strong.</span><NavLink to="/support" onClick={guard('/support')}><CircleHelp size={14} /> Need a hand?</NavLink><NavLink to="/settings" onClick={guard('/settings')}><Settings size={14} /> Settings</NavLink></footer></main>
  <nav className="mobile-dock">{links.slice(0, 5).map(({ label, to, icon: Icon }) => <NavLink onClick={guard(to)} key={to} to={to} className={({ isActive }) => `dock-link ${isActive ? 'active' : ''}`}><Icon size={19} /><span>{label === 'Overview' ? 'Home' : label}</span></NavLink>)}</nav></div>
}