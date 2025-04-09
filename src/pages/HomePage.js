import './HomePage.css';
import Button from '../components/Button'
import { getSocket, sendRoomMessage } from '../lib/socket';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getSocket();

    socket.once('connect', () => {
      console.log('[App] Socket connected:', socket.id);
    });
  }, []);

  return (
    <div className='div_homepage_1'>
        <h1>Welcome Quick Clash!</h1>
        <Button label="Solo" onClick={() => sendRoomMessage('startSoloRoom', navigate)}/>
        <Button label="VS" onClick={() => console.log('VS mode clicked!')}/>
    </div>
  );
}

export default HomePage;