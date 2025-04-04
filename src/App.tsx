import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./router";
import { Toaster } from "@/components/ui/sonner";
import "./styles/markdown.css";

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
