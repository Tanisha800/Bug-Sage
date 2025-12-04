"use client"
import TeamMember from '@/components/dashboard/TeamMember'
import React from 'react'


function page() {
  return (
    <div className="p-4 lg:p-6">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className='py-2 pb-8 flex  justify-between items-center'>
          <h1 className='font-readex font-semibold text-5xl text-foreground'>Team</h1>

        </div>
        <div className='bg-gray-100 p-2 rounded-2xl dark:bg-neutral-800'>

          <TeamMember />

        </div>

      </div>
    </div>
  )
}

export default page