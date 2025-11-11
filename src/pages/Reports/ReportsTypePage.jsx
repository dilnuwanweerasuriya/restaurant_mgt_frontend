import React from 'react'
import OptionsButton from '../../components/OptionsButton'
import Grid from '../../components/Grid'
import { BiChart } from 'react-icons/bi'

export default function ReportsTypePage() {
    return (
        <div className='p-8'>
            <OptionsButton />

            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
                <Grid path="/sales_report" name="Sales" icon={<BiChart size={40} />} />
            </div>
        </div>
    )
}
