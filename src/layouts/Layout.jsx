import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Layout() {
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Navbar />
            <Outlet />
        </main>
    )
}

export default Layout
