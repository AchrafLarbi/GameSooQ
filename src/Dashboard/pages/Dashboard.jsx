import { useEffect, useState } from "react";
import { Users, Gamepad2, Monitor, FileText } from "lucide-react";
import { db } from "../../services/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import StatCard from "@/Dashboard/components/StatCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    games: 0,
    consoles: 0,
    Gameposts: 0,
    Consoleposts: 0,
    newGames: 0,
    newConsoles: 0,
    AllGames: 0,
    AllConsoles: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          usersCount,
          gamePostsCount,
          consolePostsCount,
          consolesCount,
          gamesCount,
          newConsolesCount,
          newGamesCount,
        ] = await Promise.all([
          getCountFromServer(collection(db, "users")),
          getCountFromServer(collection(db, "game_posts")),
          getCountFromServer(collection(db, "console_posts")),
          getCountFromServer(collection(db, "console")),
          getCountFromServer(collection(db, "Games")),
          getCountFromServer(collection(db, "new_consoles")),
          getCountFromServer(collection(db, "new_games")),
        ]);

        setStats({
          users: usersCount.data().count,
          games: gamesCount.data().count,
          consoles: consolesCount.data().count,
          Gameposts: gamePostsCount.data().count,
          Consoleposts: consolePostsCount.data().count,
          newConsoles: newConsolesCount.data().count,
          newGames: newGamesCount.data().count,

          AllConsoles:
            consolesCount.data().count + newConsolesCount.data().count,
          AllGames: gamesCount.data().count + newGamesCount.data().count,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []);
  console.log(stats);

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-4 gap-6 mt-6">
        <StatCard title="Total Utilisateurs" value={stats.users} icon={Users} />
        <StatCard title="Total Jeux" value={stats.AllGames} icon={Gamepad2} />
        <StatCard
          title="Total Posts De Jeux"
          value={stats.Gameposts}
          icon={FileText}
        />
        <StatCard
          title="Total Consoles"
          value={stats.AllConsoles}
          icon={Monitor}
        />

        <StatCard
          title="Total Posts De Consoles"
          value={stats.Consoleposts}
          icon={FileText}
        />
      </div>
    </div>
  );
};

export default Dashboard;
