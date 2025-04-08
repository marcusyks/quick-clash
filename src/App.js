import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { getSocket } from './lib/socket';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      console.log('[App] Socket connected:', socket.id);
    });

    return () => {
      socket.off('connect'); // clean up
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
