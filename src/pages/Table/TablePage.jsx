import React from 'react'
import { MdTableRestaurant } from 'react-icons/md'
import OptionsButton from '../../components/OptionsButton'
import { FaTable } from 'react-icons/fa'
import Grid from '../../components/Grid';

function TablePage() {

    return (
        <div className='p-8'>
            <OptionsButton />

            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
                <Grid path="/tables/reserve" name="Reserve a Table" icon={<FaTable size={40} />} />
                <Grid path="/tables/reservations" name="Reservations" icon={<MdTableRestaurant size={40} />} />
                <Grid path="/tables/list" name="All Tables" icon={<MdTableRestaurant size={40} />} />
            </div>
        </div>
    )
}

export default TablePage