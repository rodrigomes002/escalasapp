import AppProvider from "./providers";
import AppRouter from "./routes";

const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};

export default App;
