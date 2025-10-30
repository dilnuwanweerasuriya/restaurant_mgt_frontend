import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { MdTableRestaurant } from 'react-icons/md'
import DashboardButton from '../../components/DashboardButton'
import { useNavigate } from 'react-router-dom';

function OrderPage() {
  const navigate = useNavigate();

  return (
    <div className='p-8'>
        <DashboardButton />

        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
            <div onClick={() => navigate('/orders/add')} className='bg-white border-2 border-gray-300 hover:border-black shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all'>
                <div className='text-black mb-4'><BiPlus size={40} /></div>
                <span className='text-lg font-semibold'>Add Order</span>
            </div>

            <div onClick={() => navigate('/orders/list')} className='bg-white border-2 border-gray-300 hover:border-black shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all'>
                <div className='text-black mb-4'><MdTableRestaurant size={40} /></div>
                <span className='text-lg font-semibold'>All Orders</span>
            </div>
        </div>
    </div>
  )
}

export default OrderPage