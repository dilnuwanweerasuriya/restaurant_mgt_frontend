import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { MdPeople } from 'react-icons/md'
import OptionsButton from '../../components/OptionsButton';
import Grid from '../../components/Grid';

export default function Users() {

  return (
    <div className="p-8">
      <OptionsButton />

      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-10'>
        <Grid path="/users/add" name="Add User" icon={<BiPlus size={40} />} />
        <Grid path="/users/list" name="All Users" icon={<MdPeople size={40} />} />
      </div>
    </div>
  )
}
