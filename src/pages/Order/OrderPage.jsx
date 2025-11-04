import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { MdTableRestaurant } from 'react-icons/md'
import OptionsButton from '../../components/OptionsButton'
import Grid from '../../components/Grid';

function OrderPage() {
  return (
    <div className='p-8'>
        <OptionsButton />

        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
            <Grid path="/orders/add" name="Add Order" icon={<BiPlus size={40} />} />
            <Grid path="/orders/list" name="All Orders" icon={<MdTableRestaurant size={40} />} />
        </div>
    </div>
  )
}

export default OrderPage