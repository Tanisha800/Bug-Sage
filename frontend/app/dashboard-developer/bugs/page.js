import FilterUser from '@/components/dashboard/FilterUSer'
import Kanban from '@/components/dashboard/Kanban'

import React from 'react'

function page() {
  return (
    <div className="p-4 lg:p-6">
      <div className="@container/main flex flex-1 flex-col gap-2">
      <div className='py-2 pb-8 flex items-center justify-between'>
      <h1 className='font-readex font-semibold text-5xl text-foreground '>Bugs</h1> 

      </div>

      <Kanban/>
    </div>
    </div>
  )
}

export default page