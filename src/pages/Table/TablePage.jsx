import React from 'react'
import { MdTableRestaurant } from 'react-icons/md'
import DashboardButton from '../../components/DashboardButton'
import { FaTable } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

function TablePage() {
  const navigate = useNavigate();

  return (
    <div className='p-8'>
        <DashboardButton />

        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
            <div onClick={() => navigate('/tables/reserve')} className='bg-white border-2 border-gray-300 hover:border-black shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all'>
                <div className='text-black mb-4'><FaTable size={40} /></div>
                <span className='text-lg font-semibold'>Reserve a Table</span>
            </div>

            <div onClick={() => navigate('/tables/reservations')} className='bg-white border-2 border-gray-300 hover:border-black shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all'>
                <div className='text-black mb-4'><FaTable size={40} /></div>
                <span className='text-lg font-semibold'>Reservations</span>
            </div>

            <div onClick={() => navigate('/tables/list')} className='bg-white border-2 border-gray-300 hover:border-black shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all'>
                <div className='text-black mb-4'><MdTableRestaurant size={40} /></div>
                <span className='text-lg font-semibold'>All Tables</span>
            </div>
        </div>
    </div>
  )
}

export default TablePage