import { Users, Gamepad2, Monitor, FileText } from "lucide-react";
import StatCard from "@/Dashboard/components/StatCard";
import Header from "@/Dashboard/components/Header";

const Dashboard = () => {
  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-4 gap-6 mt-6">
        <StatCard
          title="Total Utilisateurs"
          value="1,234"
          percentage="+12%"
          icon={Users}
        />
        <StatCard
          title="Total Jeux"
          value="584"
          percentage="+8%"
          icon={Gamepad2}
        />
        <StatCard
          title="Total Consoles"
          value="48"
          percentage="+2%"
          icon={Monitor}
        />
        <StatCard
          title="Total Posts"
          value="2,845"
          percentage="+18%"
          icon={FileText}
        />
      </div>
    </div>
  );
};

export default Dashboard;
