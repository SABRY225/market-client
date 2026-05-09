import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function LayoutClient() {
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Outlet />
        </main>
    )
}

export default LayoutClient
