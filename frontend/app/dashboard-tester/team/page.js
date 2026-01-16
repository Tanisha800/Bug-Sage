"use client"
import TeamMember from '@/components/dashboard/TeamMember'
import { SiteHeader } from '@/components/layout/site-header'
import React from 'react'


function page() {
  return (
    <div><SiteHeader>Teams</SiteHeader>
      <div className="p-4 lg:p-6">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className='bg-gray-100 p-2 rounded-2xl dark:bg-neutral-800'>

            <TeamMember />

          </div>

        </div>
      </div>
    </div>
  )
}

export default page