import {
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Cloud,
} from "lucide-react";
import { Route, Routes } from "react-router";
import Home from "./pages/home";
import Header from "./components/header";
import { ToastContainer } from 'react-toastify';
import Admin from "./pages/admin";
import { DataContext } from "./context/contentContext";

export default function App() {
  const [mode, setMode] = useState<"store" | "admin">("store");

  const { online, refresh } = useContext(DataContext)

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_85%_2%,#ff79000c,transparent_26%),#faf8f7]">
      <ToastContainer />
      <Header
        mode={mode}
        online={online}
        setMode={setMode}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home />
          }
        />
        <Route
          path="/admin"
          element={
            <Admin />
          }
        />
      </Routes>

      <footer className="mt-5 px-[clamp(18px,5vw,76px)] py-[clamp(6px,3vh,40px)] flex items-center justify-between gap-3 border-t border-line text-[9px] tracking-[0.3px] text-[#9a8c9d] max-[680px]:flex-col max-[680px]:items-start max-[680px]:gap-2">
        <span className="flex items-center gap-1.5">
          <b className="tracking-[1px] text-purple-700">AWAKE CAMP</b>
          · IT'S TIME TO AWAKE
        </span>

        <span className="flex items-center gap-1.5">
          <Cloud size={14} />
          Consumo registrado na conta individual
        </span>
      </footer>
    </div >
  );
}
