import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from './pages/Layout';
import ErrorPage from './pages/ErrorPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<HomePage/>}/>
          <Route path='game/:roomID' element={<GamePage/>}/>
          <Route path="*" element={<ErrorPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
