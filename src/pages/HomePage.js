import './HomePage.css';
import Button from '../components/Button'
import { getSocket, sendRoomMessage } from '../lib/socket';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function HomePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // 'waiting' or 'inGame'

  useEffect(() => {
    const socket = getSocket();

    const handleWaiting = () => {
      console.log('[HomePage] Waiting for players...');
      setStatus('waiting');
    };

    const handleGameStarted = ({roomID, playerTurn, turn}) => {
      console.log('[HomePage] Game started', roomID);
      localStorage.setItem('playerTurn', playerTurn);
      localStorage.setItem('turn', turn);
      setStatus('inGame');
      // send socket message to initialize game
      setTimeout(() => {
        navigate(`/game/${roomID}`);
      }, 3000);
    };

    socket.on('waitGame', handleWaiting);
    socket.on('startGame', handleGameStarted);

    return () => {
      socket.off('waitGame', handleWaiting);
      socket.off('startGame', handleGameStarted);
    };
  }, [navigate]);

  const handleClick = () => {
    sendRoomMessage('createRoom');
    setStatus('waiting');
  }

  return (
    <div className='div_homepage_1'>
        <h1 className='homepage_h1'>Welcome To Quick Clash!</h1>
        <Button label="VS" onClick={handleClick}/>

        {status === 'waiting' && (
            <p>Waiting for players to join...</p>
        )}
        {status === 'inGame' && <div className='div_inGame'><p>Game is starting...</p></div>}
    </div>
  );
}

export default HomePage;