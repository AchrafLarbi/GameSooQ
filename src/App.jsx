import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Aide from "./pages/Aide";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/layout/ProtectedRoute";
// import LoginForm from "./components/layout/LoginForm";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/faq/:id" element={<Aide />} />
          <Route
            path="/politique-confidentialite"
            element={<PolitiqueConfidentialite />}
          />
          <Route
            path="/privacy"
            element={
              <PolitiqueConfidentialite key={window.location.pathname} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

// Separate PageTracking Component

export default App;
