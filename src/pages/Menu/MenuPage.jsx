import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { MdMenu } from 'react-icons/md'
import OptionsButton from '../../components/OptionsButton';
import Grid from '../../components/Grid';

function MenuPage() {

    return (
        <div className='p-8'>
            <OptionsButton />

            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
                <Grid path="/menu/add" name="Add Menu" icon={<BiPlus size={40} />} />
                <Grid path="/menu/list" name="All Menu" icon={<MdMenu size={40} />} />
            </div>
        </div>
    )
}

export default MenuPage