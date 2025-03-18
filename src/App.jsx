import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Aide from "./pages/Aide";
import FAQSection from "./components/FAQSection";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Login from "./Dashboard/pages/Login";
import Admin from "./Dashboard/Admin";
import Dashboard from "./Dashboard/pages/Dashboard";
import Users from "./Dashboard/pages/Users";
import Games from "./Dashboard/pages/Games";
import Consoles from "./Dashboard/pages/Consoles";
import Posts from "./Dashboard/pages/Posts";
import ProtectedRoute from "./Dashboard/ProtectedRoute";
import RegisterAdmin from "./pages/RegisterAdmin";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./features/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("role");
    const user = isAuthenticated
      ? { email: localStorage.getItem("email") }
      : null;

    if (isAuthenticated && user) {
      dispatch(loginSuccess({ user, role }));
    }
  }, [dispatch]);
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
        <Route path="/FAQ" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/register-admin"
          element={<ProtectedRoute allowedRoles={["super_admin"]} />}
        >
          <Route path="" element={<RegisterAdmin />} />
        </Route>

        <Route
          path="/operation"
          element={<ProtectedRoute allowedRoles={["super_admin", "admin"]} />}
        >
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
