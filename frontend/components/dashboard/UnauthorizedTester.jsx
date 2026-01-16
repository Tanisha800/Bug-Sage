"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu } from "../ui/dropdown-menu";
import JoinTeamSelect from "./JoinTeamSelect";

import { ShieldAlert } from "lucide-react"


export default function UnauthorizedTester() {
    return (


        <Dialog>
            <DialogContent className="max-w-md rounded-2xl p-6">
                <DialogHeader className="flex flex-row items-start gap-3">

                    {/* Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                    </div>

                    {/* Text */}
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

    )
}