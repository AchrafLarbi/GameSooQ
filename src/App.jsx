import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/layout/ProtectedRoute";
// import LoginForm from "./components/layout/LoginForm";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route
            path="/houarioran31"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginForm />} />
          {/* <Route path="/register" element={<RegisterForm />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

// Separate PageTracking Component

export default App;
