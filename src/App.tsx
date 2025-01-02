import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./router";
import { Toaster } from "@/components/ui/sonner";
function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
