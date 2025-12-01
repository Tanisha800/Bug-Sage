import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  const items = [
    {
      balance: "$1,250.00",
      email: "alex.t@company.com",
      id: "1",
      image:
        "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-02_upqrxi.jpg",
      location: "San Francisco, US",
      name: "Alex Thompson",
      status: "10",
      username: "@alexthompson",
    },
    {
      balance: "$600.00",
      email: "sarah.c@company.com",
      id: "2",
      image:
        "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-01_ij9v7j.jpg",
      location: "Singapore",
      name: "Sarah Chen",
      status: "2",
      username: "@sarahchen",
    },
    {
      balance: "$0.00",
      email: "m.garcia@company.com",
      id: "4",
      image:
        "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-03_dkeufx.jpg",
      location: "Madrid, Spain",
      name: "Maria Garcia",
      status: "8",
      username: "@mariagarcia",
    },
    {
      balance: "-$1,000.00",
      email: "d.kim@company.com",
      id: "5",
      image:
        "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-05_cmz0mg.jpg",
      location: "Seoul, KR",
      name: "David Kim",
      status: "4",
      username: "@davidkim",
    },
  ];
  
  export default function TeamMember() {
    return (
      <div>
        <Table className="bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <TableHeader className="p-8">
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right" >Bugs Assigned</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      alt={item.name}
                      className="rounded-full"
                      height={40}
                      src={item.image}
                      width={40}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <span className="mt-0.5 text-muted-foreground text-xs">
                        {item.username}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="text-right">{item.status}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  