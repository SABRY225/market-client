import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="brand">Admin Dashboard</div>
      <nav className="nav">
        <NavLink to="/" end className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <span>📊</span> <span style={{marginLeft:8}}>Dashboard</span>
        </NavLink>
        <NavLink to="/users" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <span>👥</span> <span style={{marginLeft:8}}>Users</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          <span>⚙️</span> <span style={{marginLeft:8}}>Settings</span>
        </NavLink>
      </nav>
    </aside>
  )
}
