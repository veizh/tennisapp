import { Routes, Route, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Loading } from './component/loading';

import { NavBar } from './component/NavBar';
import logo from './logo.svg';
import './styles/main.css';
import './styles/simulationPage/simulation.css';
import Simulations from "./pages/tenniscourt";
import Results from "./pages/Results";

function App() {
  return (
    <div className="App">
      <NavBar />
         <Routes>
                            <Route path="/" element={<Loading />} />
                            <Route path="/simulation" element={<Simulations />} />
                            <Route path="/results" element={<Results />} />
                            
                        </Routes>
    </div>
  );
}

export default App;
