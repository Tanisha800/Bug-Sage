import Kanban from '@/components/dashboard/Kanban'
import { SiteHeader } from '@/components/layout/site-header'

import React from 'react'

function page() {
  return (
    <div><SiteHeader>Bugs</SiteHeader>
      <div className="p-4 lg:p-6">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <Kanban />
        </div>
      </div>
    </div>
  )
}

export default page