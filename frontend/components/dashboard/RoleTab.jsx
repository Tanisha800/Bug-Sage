import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  
  export default function RoleTab() {
    return (
      <Tabs className="items-center" defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1">Tester</TabsTrigger>
          <TabsTrigger value="tab-2">Developer</TabsTrigger>

        </TabsList>
      </Tabs>
    );
  }
  