"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { useState } from 'react';

function UpdateBug() {
      const [open, setOpen] = useState(false);
  return (
    <div><Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >Update</DialogTrigger>

      <DialogContent className="w-[75%] max-w-none">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">Raise a Bug</DialogTitle>
          </DialogHeader>
        </div>

        
      </DialogContent>
    </Dialog></div>
  )
}

export default UpdateBug