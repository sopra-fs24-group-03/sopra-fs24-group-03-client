import React, { useEffect } from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  useEffect(() => {
    localStorage.clear()
  }, []);
  return (
    <div>
      <AppRouter />
    </div>
  );
};

export default App;
