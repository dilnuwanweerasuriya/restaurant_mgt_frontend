import React from 'react'
import { Link } from 'react-router-dom'

export default function OptionsButton() {
    return (
        <div className='mb-10'>
            <button className='bg-zinc-900 border-2 border-zinc-800 hover:border-white shadow-md hover:shadow-lg text-white font-semibold px-4 py-2 rounded cursor-pointer'>
                <Link to='/options'>Back to Options</Link>
            </button>
        </div>
    )
}
