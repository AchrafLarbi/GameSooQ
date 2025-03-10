import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ title, value, percentage, icon: Icon }) => {
  return (
    <Card className="w-64">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <Icon size={24} />
      </CardHeader>
      <CardContent>
        <h2 className="text-3xl font-bold">{value}</h2>
        <p className="text-sm text-gray-400">{percentage} depuis le mois dernier</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
