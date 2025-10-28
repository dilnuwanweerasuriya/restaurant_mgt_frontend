import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardButton() {
    return (
        <div className='mb-10'>
            <button className='bg-black text-white font-semibold px-4 py-2 rounded cursor-pointer'>
                <Link to='/'>Back to Dashboard</Link>
            </button>
        </div>
    )
}
