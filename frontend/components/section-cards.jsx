"use client"

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import axios from "@/lib/axios";
import { Badge } from "@/components/ui/badge"


import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState,useEffect } from "react";

export function SectionCards() {
  const[stats,setStats]=useState({
    pendingBugs: 0,
    inProgress: 0,
    tested: 0,
    resolvedBugs: 0,
  })
  const[loading,setLoading]=useState(true)
  useEffect(()=>{
    async function fetchStats(){
      try{
        const res=await axios.get("tasks/stats/summary")
        setStats({
          pendingBugs: res.data.backlog,
          inProgress: res.data.inProgress,
          tested: res.data.testing,
          resolvedBugs: res.data.resolved
        });
      }
      catch(error){
        console.error("Error fetching dashboard stats:", error);
      }
      finally{
        setLoading(false);
        console.log(stats)
      }
    }fetchStats();
  },[])
    

  return (
    <div
      className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Backlog</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.pendingBugs}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
          Increasing this week
          </div>
          <div className="text-muted-foreground">
          New issues detected across multiple modules
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>In Progress</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.inProgress}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
          Developers actively working
          </div>
          <div className="text-muted-foreground">
          Fixes under review and validation
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Testing</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.tested}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
          Stable builds produced
          </div>
          <div className="text-muted-foreground">Most fixes cleared automated testing</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Resolved</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.resolvedBugs}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
          High resolution efficiency
          </div>
          <div className="text-muted-foreground">Bugs closed after QA verification</div>
        </CardFooter>
      </Card>
    </div>
  );

}