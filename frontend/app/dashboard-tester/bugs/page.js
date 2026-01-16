"use client"
import FilterUser from '@/components/dashboard/FilterUser'
import KanbanTester from '@/components/dashboard/KanbanTester'
import { SiteHeader } from '@/components/layout/site-header'
import React from 'react'
import { useErrorStore } from "@/lib/errorStore"
import { useState } from "react"


import { ShieldAlert } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"



function page() {
  const { unauthorizedOpen, closeUnauthorized } = useErrorStore()
  const [selectedDeveloperId, setSelectedDeveloperId] = useState("ALL");
  return (
    <div><SiteHeader>Bugs</SiteHeader>
      <div className="p-4 lg:p-6">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className='flex items-center justify-end'>
            <FilterUser
              selectedDeveloperId={selectedDeveloperId}
              onDeveloperChange={setSelectedDeveloperId}
            />

          </div>
          <KanbanTester developerId={selectedDeveloperId} />
          <Dialog open={unauthorizedOpen} onOpenChange={closeUnauthorized}>
            <DialogContent className="max-w-md rounded-2xl p-6">
              <DialogHeader className="flex flex-row items-start gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                </div>

                <div className="space-y-1">
                  <DialogTitle className="text-lg font-semibold text-red-600">
                    Unauthorized Access
                  </DialogTitle>

                  <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                    This task was assigned by another tester.
                    <br />
                    You don’t have permission to edit this task.
                  </DialogDescription>
                </div>

              </DialogHeader>


            </DialogContent>

          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default page