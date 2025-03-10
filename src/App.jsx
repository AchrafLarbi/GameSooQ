import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Aide from "./pages/Aide";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Login from "./Dashboard/pages/Login";
import Admin from "./Dashboard/Admin";
import Dashboard from "./Dashboard/pages/Dashboard";
import Users from "./Dashboard/pages/Users";
import Games from "./Dashboard/pages/Games";
import Consoles from "./Dashboard/pages/Consoles";
import Posts from "./Dashboard/pages/Posts";
import ProtectedRoute from "./Dashboard/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/faq/:id" element={<Aide />} />
        <Route
          path="/politique-confidentialite"
          element={<PolitiqueConfidentialite />}
        />
        <Route
          path="/privacy"
          element={<PolitiqueConfidentialite key={window.location.pathname} />}
        />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="" element={<Admin />}>
            <Route path="home" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="games" element={<Games />} />
            <Route path="consoles" element={<Consoles />} />
            <Route path="posts" element={<Posts />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
