import React from 'react'
import OptionsButton from '../../components/OptionsButton'
import { GiEating } from 'react-icons/gi'
import { BiPackage } from 'react-icons/bi'
import Grid from '../../components/Grid'

export default function OrderTypePage() {
    return (
        <div className='p-8'>
            <OptionsButton />

            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
                <Grid path="/orders/add/1" name="Dine-In" icon={<GiEating size={40} />} />
                <Grid path="/orders/add/2" name="Take Away" icon={<BiPackage size={40} />} />
            </div>
        </div>
    )
}
