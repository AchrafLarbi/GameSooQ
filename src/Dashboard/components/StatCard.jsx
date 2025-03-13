import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ title, value, icon: Icon }) => {
    return (
      <Card className="w-full shadow-md border rounded-xl border-zinc-900 bg-zinc-950 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Icon className="h-6 w-6 text-gray-400" /> 
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{value}</p>
        </CardContent>
      </Card>
    );
  };
  export default StatCard;