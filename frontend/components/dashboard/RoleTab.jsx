import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function RoleTab({ onRoleChange }) {
  return (
    <Tabs

      defaultValue="TESTER"
      onValueChange={(value) => onRoleChange(value)}
      className="items-center"

    >
      <TabsList>
        <TabsTrigger value="TESTER">Tester</TabsTrigger>
        <TabsTrigger value="DEVELOPER">Developer</TabsTrigger>

      </TabsList>
    </Tabs>
  );
}
