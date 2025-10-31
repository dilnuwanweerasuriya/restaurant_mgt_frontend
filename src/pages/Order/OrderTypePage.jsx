import React from 'react'
import OptionsButton from '../../components/OptionsButton'
import { useNavigate } from 'react-router-dom'
import { GiEating } from 'react-icons/gi'
import { BiPackage } from 'react-icons/bi'

export default function OrderTypePage() {
    const navigate = useNavigate()

    return (
        <div className='p-8'>
            <OptionsButton />

            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
                <div onClick={() => navigate('/orders/add/1')} className='bg-white border-2 border-gray-300 hover:border-black shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all'>
                    <div className='text-black mb-4'><GiEating size={40} /></div>
                    <span className='text-lg font-semibold'>Dine-In</span>
                </div>

                <div onClick={() => navigate('/orders/add/2')} className='bg-white border-2 border-gray-300 hover:border-black shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all'>
                    <div className='text-black mb-4'><BiPackage size={40} /></div>
                    <span className='text-lg font-semibold'>Take Away</span>
                </div>
            </div>
        </div>
    )
}
