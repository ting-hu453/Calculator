import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Screen from "./components/Screen";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="Calculator">
        <Routes>
          <Route path="/" element={<Screen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
