import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ThemeProvider } from "./components/Theme-provider";
import ProductForm from "./components/producForm/ProductForm";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <Outlet />
        <Footer />
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;
