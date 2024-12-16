import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <DashboardPage />
  ) : (
    <LoginPage setIsLoggedIn={setIsLoggedIn} />
  );
};

export default App;
